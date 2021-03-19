#!/usr/bin/env node
'use strict';

const { createWriteStream } = require('fs');
const { createCanvas, loadImage } = require('canvas');
const glob = require('glob');
const yargs = require('yargs');
const config = require('./config');
const { description } = require('./package');

const { argv } = yargs
  .command('$0 [images..]', description)
  .options(config)
  .scriptName('pdf')
  .alias('version', 'v')
  .strict()
  .help();

main().catch(error => {
  log(`${error.name}: ${error.message}`);
  process.exitCode = 1;
});

async function main() {
  const destination = argv.file && !argv.dry
    ? createWriteStream(argv.file)
    : process.stdout;

  if (destination.isTTY && !argv.file) {
    log('[WARN] output appears to be a terminal device');
    log('[WARN] either use --file or redirect the output');
  }

  const { compare } = new Intl.Collator(undefined, { numeric: true });
  const images = argv.images
    .flatMap(pattern => glob.sync(pattern).sort(compare))
    .map((filename, index) => [index, filename, task(() => loadImage(filename))]);

  let canvas;
  let ctx;

  const next = (image) => {
    const { width, height } = typeof argv.width === 'number' ? argv : image;

    if (ctx) {
      ctx.addPage(width, height);
    } else {
      canvas = createCanvas(width, height, 'pdf');
      ctx = canvas.getContext('2d');
    }

    return { width, height };
  };

  for (const [index, filename, promise] of images) {
    progress(100 * index / images.length, `Loading page ${index + 1}: ${filename}`);

    await task(async () => {
      const image = await promise;
      const page = next(image);
      const { left, top, width, height } = size(page, image);

      ctx.drawImage(image, left, top, width, height);
    });
  }

  progress(100, `Writing output${argv.file ? ` to ${argv.file}` : ''}`);

  await task(async () => {
    const {
      title, author, subject, keywords, creator, created, modified,
    } = argv;
    const config = {
      title, author, subject, creator,
      keywords: keywords && keywords.join(' '),
      creationDate: created && new Date(created),
      modDate: modified && new Date(modified),
    };

    await new Promise((resolve, reject) => {
      canvas.createPDFStream(config).pipe(destination).once('close', resolve).once('error', reject);
    });
  });
}

async function task(fn) {
  if (!argv.dry) {
    return fn();
  }
}

function size(page, image) {
  const pageRatio = page.width / page.height;
  const imageRatio = image.width / image.height;
  const widthScale = page.width / image.width;
  const heightScale = page.height / image.height;

  const scale = {
    contain: imageRatio > pageRatio,
    cover: !(imageRatio > pageRatio),
  }[argv.size] ? widthScale : heightScale;

  const width = image.width * scale;
  const height = image.height * scale;
  const left = (page.width - width) * argv.left / 100;
  const top = (page.height - height) * argv.top / 100;

  return { left, top, width, height };
}

function progress(percent, message) {
  if (argv.dry || argv.progress) {
    log(`[${percent.toFixed(0).padStart(3)}%] ${message}`);
  }
}

function log(message) {
  if (!argv.quiet) {
    console.error(message);
  }
}
