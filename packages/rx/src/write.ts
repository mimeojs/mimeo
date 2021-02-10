import { BaseEncodingOptions, Mode, OpenMode } from "fs";
import { writeFile } from "fs/promises";
import { mergeMap } from "rxjs/operators";
import VFile from "vfile";

export type WriteFileOptions =
  | (BaseEncodingOptions & { mode?: Mode; flag?: OpenMode })
  | BufferEncoding
  | null;

/**
 * Writes VFile and returns path
 * @param vfile VFile
 * @param options Write file options
 */
const writeVFile = async (vfile: VFile.VFile, options?: WriteFileOptions) => {
  const { path, contents, data } = vfile;
  if (!path) {
    vfile.fail("unable to write: no path present in vfile");
  }
  await writeFile(path, JSON.stringify({ data, contents }), options);
  return path;
};

/**
 * Writes vfiles to disk
 * @param options Write file options
 */
export const write = (options?: WriteFileOptions) =>
  mergeMap<VFile.VFile, Promise<string>>((vfile) => writeVFile(vfile, options));
