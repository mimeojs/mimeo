import { fs } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import { from, Observable } from "rxjs";
import { rxToStream, streamToRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import split from "split2";
import { newLine, win2posix } from "../../utils";

export default class List extends Command {
  static description = "lists files matching a glob pattern";
  static usage = "list [...PATTERN]";
  static strict = false;
  static args = [
    {
      name: "pattern",
      description: "glob pattern of files to match",
    },
  ];
  static flags = {
    help: flags.help({ char: "h" }),
  };

  private input$!: Observable<string>;

  async init() {
    const { stdin } = process;
    // parse arguments
    const { argv } = this.parse(List);
    // stdin is attached to a terminal
    if (stdin.isTTY) {
      // error if we don't have argv
      if (!argv.length) {
        this.error("Must provide PATTERN if STDIN is not piped", {
          code: "ARGS_PATTERN",
          suggestions: [
            "Either provide glob patterns as arguments or pipe them on stdin",
          ],
          exit: 2,
        });
      }
      // otherwise create observable from argv
      else {
        this.input$ = from(argv);
      }
    }
    // stdin is piped
    else {
      // error if we have argv
      if (argv.length) {
        this.error("Must not provide PATTERN if STDIN is piped", {
          code: "ARGS_STDIN",
          suggestions: [
            "Either provide glob patterns as arguments or pipe them on stdin",
          ],
          exit: 2,
        });
      }
      // otherwise create observable from stdin
      else {
        this.input$ = streamToRx(stdin.pipe(split()));
      }
    }
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // make sure patterns are posix
        map(win2posix),
        // list files
        fs.list()
      ),
      { objectMode: true },
      (err) =>
        this.error(err, {
          code: "RUN",
          exit: 1,
        })
    )
      // pipe newline
      .pipe(newLine())
      // pipe to stdout
      .pipe(process.stdout);
  }
}
