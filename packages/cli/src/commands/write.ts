import { write } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import VFile from "vfile";

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
      this.input$ = streamToStringRx(stdin.pipe(split()));
    }
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        map((text) => VFile(JSON.parse(text))),
        // write files
        write(),
        // add newline to each path
        map((path) => `${path}\n`)
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
