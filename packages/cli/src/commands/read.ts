import { read } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import split from "binary-split";
import { from, Observable } from "rxjs";
import { rxToStream, streamToStringRx } from "rxjs-stream";
import { map } from "rxjs/operators";

export default class Read extends Command {
  static description = "reads files to vfile";
  static usage = "read [...PATH]";
  static strict = false;
  static args = [
    {
      name: "path",
      description: "file paths",
    },
  ];
  static flags = {
    help: flags.help({ char: "h" }),
  };

  private input$!: Observable<string>;

  async init() {
    const { stdin } = process;
    // parse arguments
    const { argv } = this.parse(Read);
    // stdin is attached to a terminal
    if (stdin.isTTY) {
      // error if we don't have argv
      if (!argv.length) {
        this.error("Must provide PATH if STDIN is not piped", {
          code: "ARGS_PATH",
          suggestions: ["Either paths as arguments or pipe them on stdin"],
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
        this.error("Must not provide PATH if STDIN is piped", {
          code: "ARGS_STDIN",
          suggestions: ["Either paths as arguments or pipe them on stdin"],
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
        // list files
        read(),
        // serialize vfile
        map((vfile) => {
          const contents = String(vfile.contents);
          return JSON.stringify({ ...vfile, contents });
        }),
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
