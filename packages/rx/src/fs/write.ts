import { BaseEncodingOptions, Mode, OpenMode } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { parse } from "path";
import { mergeMap } from "rxjs/operators";
import { VFile } from "vfile";

export type WriteFileOptions =
  | (BaseEncodingOptions & { mode?: Mode; flag?: OpenMode })
  | BufferEncoding
  | null;

/**
 * Writes VFile and returns path
 * @param vfile VFile
 * @param options Write file options
 */
const writeVFile = async (vfile: VFile, options?: WriteFileOptions) => {
  const { path, contents } = vfile;
  // throw if we don't have a path prop
  if (!path) {
    vfile.fail("unable to write: no path present in vfile");
  }
  // parse directory
  const { dir } = parse(path);
  // create directory (if needed)
  if (dir) {
    await mkdir(dir, {
      recursive: true,
    });
  }
  // write file
  await writeFile(path, contents, options);
  // return written path
  return path;
};

/**
 * Writes vfiles to disk
 * @param options Write file options
 */
export const write = (options?: WriteFileOptions) =>
  mergeMap<VFile, Promise<string>>((vfile) => writeVFile(vfile, options));
