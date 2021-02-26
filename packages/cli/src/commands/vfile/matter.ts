import { vfile } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import VFile from "vfile";

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
      this.input$ = streamToStringRx(stdin.pipe(split()));
    }
    // create options
    this.options = { strip };
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        map((text) => VFile(JSON.parse(text))),
        // extract frontmatter files
        vfile.matter(this.options),
        // serialize vfile
        map((vfile) => JSON.stringify(vfile)),
        // add newline to each json
        map((json) => `${json}\n`)
      ),
      undefined,
      (err) =>
        this.error(err, {
          code: "RUN",
          exit: 1,
        })
    )
      // pipe to stdout
      .pipe(process.stdout);
  }
}
