import { map } from "rxjs/operators";
import { VFile, VFileCompatible } from "vfile";
import renameVFile, { Renames } from "vfile-rename";
export { Renames } from "vfile-rename";

/**
 * Renames vfile
 * @param renames Rename instructions
 */
export const rename = (renames?: Renames) =>
  map<VFileCompatible, VFile>((vfile) => renameVFile(vfile, renames));
