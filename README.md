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
  -v, --version   Show version number                                  [boolean]
  -i, --images    Image input filenames                       [array] [required]
  -f, --file      PDF output filename                                   [string]
  -s, --size         [string] [choices: "contain", "cover"] [default: "contain"]
  -l, --left      Set percent padding left                [number] [default: 50]
  -t, --top       Set percent padding top                 [number] [default: 50]
  -w, --width     Set pixel width                                       [number]
  -h, --height    Set pixel height                                      [number]
  -d, --dry       Perform dry run                                      [boolean]
  -p, --progress  Show progress                                        [boolean]
  -q, --quiet     Silence warnings                                     [boolean]
      --title     Set title                                             [string]
      --author    Set author                                            [string]
      --subject   Set subject                                           [string]
      --keywords  Set keywords                                           [array]
      --creator   Set creator                                           [string]
      --created   Set creation date                                     [string]
      --modified  Set modified date                                     [string]
      --help      Show help                                            [boolean]
```

## Credit

Built with [node-canvas][canvas], [yargs], and [glob].

## License

Available under the MIT License (c) 2021 Patrick Roberts

[canvas]: https://www.npmjs.com/package/canvas
[yargs]: https://www.npmjs.com/package/yargs
[glob]: https://www.npmjs.com/package/glob
