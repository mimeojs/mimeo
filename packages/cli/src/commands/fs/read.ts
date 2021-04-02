import { fs } from "@mimeojs/rx";
import { Command, flags } from "@oclif/command";
import { stringify } from "ndjson";
import { from, Observable } from "rxjs";
import { rxToStream, streamToRx } from "rxjs-stream";
import { map } from "rxjs/operators";
import split from "split2";

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
        this.input$ = streamToRx(stdin.pipe(split()));
      }
    }
  }

  async run() {
    // convert observable to writable stream
    rxToStream(
      this.input$.pipe(
        // read files
        fs.read(),
        // make sure contents of vfile is a string
        map((vfile) => {
          vfile.contents = String(vfile.contents);
          return vfile;
        })
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
