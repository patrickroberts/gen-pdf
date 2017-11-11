#!/usr/bin/env node
'use strict'

const { resolve } = require('path')
const { promisify } = require('util')

const { inject } = require('di-proxy')
const { fs: { writeFile, readdir, stat } } = inject(name => {
  return inject(method => {
    return promisify(require(name)[method])
  })
})

const yargs = require('yargs')
const argv = yargs
  .options(require('./config'))
  .command('$0 <file> [images]')
  .alias('version', 'v')
  .help()
  .wrap(process.stdout.columns)
  .argv

if (argv.orientation === 'landscape') {
  const { width: height, height: width } = argv
  Object.assign(argv, { width, height })
}

const filterRegExp = new RegExp(argv.match, 'i')
const pageWidth = argv.width
const pageHeight = argv.height
const pageRatio = pageWidth / pageHeight

const size = {
  contain (imageWidth, imageHeight) {
    const imageRatio = imageWidth / imageHeight
    const widthScale = pageWidth / imageWidth
    const heightScale = pageHeight / imageHeight
    const isLandscape = imageRatio > pageRatio
    const scale = isLandscape ? widthScale : heightScale
    const width = imageWidth * scale
    const height = imageHeight * scale
    const left = isLandscape ? 0 : (pageWidth - width) * argv.left / 100
    const top = isLandscape ? (pageHeight - height) * argv.top / 100 : 0

    return { left, top, width, height }
  },
  cover (imageWidth, imageHeight) {
    const imageRatio = imageWidth / imageHeight
    const widthScale = pageWidth / imageWidth
    const heightScale = pageHeight / imageHeight
    const isLandscape = imageRatio > pageRatio
    const scale = isLandscape ? heightScale : widthScale
    const width = imageWidth * scale
    const height = imageHeight * scale
    const left = isLandscape ? (pageWidth - width) * argv.left / 100 : 0
    const top = isLandscape ? 0 : (pageHeight - height) * argv.top / 100

    return { left, top, width, height }
  }
}

const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(pageWidth, pageHeight, 'pdf')
const ctx = canvas.getContext('2d')

readdir(argv.images).then(async files => {
  await (await Promise.all(files.map(async filename => {
    const filepath = resolve(argv.images, filename)
    const isFile = (await stat(filepath).catch(error => {
      return { isFile () { return false } }
    })).isFile()
    const filter = filterRegExp.test(filename) && isFile

    return { filename, filepath, filter }
  }))).filter(({ filter }) => {
    return filter
  }).map(({ filename, filepath }) => {
    const values = []

    filename.replace(/\d+|\D+/g, match => values.push({
      isNaN: isNaN(match),
      string: String(match).toUpperCase(),
      number: Number(match)
    }))

    return { filepath, values }
  }).sort(({ values: valuesA }, { values: valuesB }) => {
    const length = Math.max(valuesA.length, valuesB.length)
    let value = 0

    for (let index = 0; !value && index < length; index++) {
      const a = valuesA[index]
      const b = valuesB[index]

      value = a.isNaN || b.isNaN
        ? -(a.string < b.string) || +(a.string > b.string)
        : a.number - b.number
    }

    return value
  }).reduce(async (promise, { filepath }) => {
    const page = 1 + await promise

    console.log(`Loading ${filepath}...`)
    const image = await loadImage(filepath)
    const { left, top, width, height } = size[argv.size](image.width, image.height)

    console.log(`Rendering page ${page}...`)
    ctx.drawImage(image, left, top, width, height)
    ctx.addPage()

    return page
  }, Promise.resolve(0))

  console.log(`Writing to ${argv.file}...`)
  return writeFile(argv.file, canvas.toBuffer())
}).catch(error => {
  console.error(error)

  yargs.showHelp()
})
