import { list } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { from, Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import { win2posix } from "../utils";

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
        this.input$ = streamToStringRx(stdin.pipe(split()));
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
        list(),
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