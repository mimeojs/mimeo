import { vfile } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import { parse, stringify } from "ndjson";
import { Observable } from "rxjs";
import { rxToStream, streamToRx } from "rxjs-stream";

export default class Matter extends Command {
  static description =
    "extracts frontmatter from vfiles piped on STDIN using the `vfile-matter` package";
  static flags = {
    help: flags.help({ char: "h" }),
    strip: flags.boolean({
      char: "s",
      description: "remove the YAML front matter from the file",
    }),
  };

  private input$!: Observable<string>;
  private options!: vfile.Options;

  async init() {
    const { stdin } = process;
    const {
      argv,
      flags: { strip },
    } = this.parse(Matter);
    // stdin is attached to a terminal
    if (stdin.isTTY) {
      // error if we are not piped
      this.error("STDIN is not piped", {
        code: "ARGS_STDIN",
        suggestions: ["pipe serialized vfiles on stdin"],
        exit: 2,
      });
    }
    // stdin is piped
    else {
      // create observable from stdin
      this.input$ = streamToRx(stdin.pipe(parse()));
    }
    // create options
    this.options = { strip };
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        vfile.create(),
        // extract frontmatter files
        vfile.matter(this.options)
      ),
      { objectMode: true },
      (err) =>
        this.error(err, {
          code: "RUN",
          exit: 1,
        })
    )
      // stringify JSON
      .pipe(stringify())
      // pipe to stdout
      .pipe(process.stdout);
  }
}
