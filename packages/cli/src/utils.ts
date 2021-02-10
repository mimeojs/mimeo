const WIN32_SEPARATOR_RE = /\\/g;

/**
 * Converts win32 patterns to posix
 * @param input Input pattern
 */
export const win2posix = (input: string) =>
  input.replace(WIN32_SEPARATOR_RE, "/");
