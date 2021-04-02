import { EOL } from "os";
import { DuplexOptions } from "stream";
import through from "through2";

const WIN32_SEPARATOR_RE = /\\/g;

/**
 * Converts win32 patterns to posix
 * @param input Input pattern
 */
export const win2posix = (input: string) =>
  input.replace(WIN32_SEPARATOR_RE, "/");

/**
 * Tries parsing `input` to JSON
 * @param input JSON string
 * @returns parsed JSON or original value
 */
export const parseJSON = <T = any>(input: any): T => {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
};

/**
 * Transform stream that adds EOL (end of line) betweeen objects
 * @param opts Duplex stream options
 * @returns Transform stream
 */
export const newLine = (opts?: DuplexOptions) =>
  through(opts, (data, _enc, cb) => cb(null, `${data}${EOL}`));
