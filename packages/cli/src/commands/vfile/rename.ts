import { vfile } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import VFile from "vfile";
import { parseJSON } from "../../utils";

export default class Rename extends Command {
  static description =
    "renames vfiles piped on STDIN using the `vfile-rename` package";
  static usage = "rename [...RENAME|-m MOVE]";
  static examples = [
    `cat vfiles.json | rename .txt`,
    `cat vfiles.json | rename '{\\"dirname\\":\\"./content\\",\\"extname\\":\\".json\\"}'`,
    `cat vfiles.json | rename -m "move.js"`,
  ];
  static strict = false;
  static args = [
    {
      name: "rename",
      description: "rename instruction",
    },
  ];
  static flags = {
    help: flags.help({ char: "h" }),
    move: flags.string({
      char: "m",
      description: "module with default export move function",
    }),
  };

  private input$!: Observable<string>;
  private renames!: vfile.Renames;

  async init() {
    const { stdin } = process;
    const {
      argv,
      flags: { move },
    } = this.parse(Rename);
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
    // import/parse renames
    this.renames = move ? (await import(move)).default : argv.map(parseJSON);
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        map((text) => VFile(JSON.parse(text))),
        // rename files
        vfile.rename(this.renames),
        // serialize vfile and add newline
        map((vfile) => `${JSON.stringify(vfile)}\n`)
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
