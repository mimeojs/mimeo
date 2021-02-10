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
export const toJSON = <T = any>(input: any): T => {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
};
