import { map } from "rxjs/operators";
import VFile, { VFileCompatible } from "vfile";

/**
 * Creates VFile
 */
export const create = () =>
  map<VFileCompatible, VFile.VFile>((input) => VFile(input));
