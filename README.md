# gen-pdf

Create a PDF file from a set of images

## Installation

```sh
npm link gen-pdf
```

## Documentation

```
pdf [images..]

Options:
  -v, --version   Show version number
  -i, --images    Image input filenames
  -f, --file      PDF output filename
  -s, --size      Set to contain or cover
  -l, --left      Set percent padding left
  -t, --top       Set percent padding top
  -w, --width     Set pixel width
  -h, --height    Set pixel height
  -d, --dry       Perform dry run
  -p, --progress  Show progress
  -q, --quiet     Silence warnings
      --title     Set title
      --author    Set author
      --subject   Set subject
      --keywords  Set keywords
      --creator   Set creator
      --created   Set creation date
      --modified  Set modified date
      --help      Show help
```

## Credit

Built with [node-canvas][canvas], [yargs], and [glob].

## License

Available under the MIT License (c) 2021 Patrick Roberts

[canvas]: https://www.npmjs.com/package/canvas
[yargs]: https://www.npmjs.com/package/yargs
[glob]: https://www.npmjs.com/package/glob
