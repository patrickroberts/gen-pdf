# gen-pdf

A command-line utility for generating a PDF file from a directory of images.

## Installation

    npm link gen-pdf

## Documentation

    pdf <file> [images]

    Options:
      --version, -v      Show version number                                     [boolean]
      --file, -f         Name of pdf file output                       [string] [required]
      --images, -i       Directory of images                       [string] [default: "."]
      --orientation, -o  Orientation of pdf pages
                         [string] [choices: "portrait", "landscape"] [default: "portrait"]
      --size, -s         Contain the image or cover the page
                               [string] [choices: "contain", "cover"] [default: "contain"]
      --left, -l         Left padding percentage                    [number] [default: 50]
      --top, -t          Top padding percentage                     [number] [default: 50]
      --width, -w        Page width in pixels                      [number] [default: 600]
      --height, -h       Page height in pixels                     [number] [default: 840]
      --match, -m        Matched filenames      [string] [default: "(gif|jpe?g|png|svg)$"]
      --help             Show help                                               [boolean]

## Credit

Built with [yargs] and [node-canvas][canvas].

## License

Available under the MIT License (c) 2017 Patrick Roberts

[yargs]: https://www.npmjs.com/package/yargs
[canvas]: https://www.npmjs.com/package/canvas
