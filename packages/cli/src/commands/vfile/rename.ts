import { vfile } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import { parse, stringify } from "ndjson";
import { Observable } from "rxjs";
import { rxToStream, streamToRx } from "rxjs-stream";
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
      this.input$ = streamToRx(stdin.pipe(parse()));
    }
    // import/parse renames
    this.renames = move ? (await import(move)).default : argv.map(parseJSON);
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // deserialize to VFile
        vfile.create(),
        // rename files
        vfile.rename(this.renames)
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
