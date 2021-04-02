import { fs, vfile } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import { parse, stringify } from "ndjson";
import { Observable } from "rxjs";
import { rxToStream, streamToRx } from "rxjs-stream";

export default class Write extends Command {
  static description = "writes files to vfile";
  static flags = {
    help: flags.help({ char: "h" }),
  };

  private input$!: Observable<string>;

  async init() {
    const { stdin } = process;
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
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        vfile.create(),
        // write files
        fs.write()
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
