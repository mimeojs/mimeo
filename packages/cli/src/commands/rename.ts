import { rename, Renames } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import VFile from "vfile";
import { toJSON } from "../utils";

export default class Rename extends Command {
  static description = "renames vfiles";
  static usage = "rename [...RENAME]";
  static strict = false;
  static args = [
    {
      name: "rename",
      description: "rename instruction",
      required: true,
    },
  ];
  static flags = {
    help: flags.help({ char: "h" }),
  };

  private input$!: Observable<string>;
  private renames!: Renames;

  async init() {
    const { stdin } = process;
    const { argv } = this.parse(Rename);
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
    // parse renames
    this.renames = argv.map(toJSON);
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        map((text) => VFile(JSON.parse(text))),
        // rename files
        rename(this.renames),
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
