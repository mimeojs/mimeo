import { map } from "rxjs/operators";
import { VFile } from "vfile";
import renameVFile, { Renames } from "vfile-rename";
export { Renames } from "vfile-rename";

/**
 * Renames vfile
 */
export const rename = (renames: Renames) =>
  map<VFile, VFile>((vfile) => renameVFile(vfile, renames));
