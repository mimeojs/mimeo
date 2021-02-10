import { BaseEncodingOptions, OpenMode } from "fs";
import { readFile } from "fs/promises";
import { mergeMap } from "rxjs/operators";
import VFile from "vfile";

export type ReadFileOptions =
  | (BaseEncodingOptions & { flag?: OpenMode })
  | BufferEncoding
  | null;

/**
 * Reads file and returns VFile
 * @param path Path to file
 * @param options Read file options
 */
const readVFile = async (path: string, options?: ReadFileOptions) => {
  const contents = await readFile(path, options);
  return VFile({
    path,
    contents,
  });
};

/**
 * Reads vfile from disk
 * @param options Read file options
 */
export const read = (options?: ReadFileOptions) =>
  mergeMap<string, Promise<VFile.VFile>>((path) => readVFile(path, options));
