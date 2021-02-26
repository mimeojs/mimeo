import { map } from "rxjs/operators";
import { VFile, VFileCompatible } from "vfile";
import matterVFile, { Options } from "vfile-matter";
export { Options } from "vfile-matter";

/**
 * Parse the YAML front matter in a [`vfile`](https://github.com/vfile/vfile)
 * @param options VFile matter options
 */
export const matter = (options?: Options) =>
  map<VFileCompatible, VFile>((vfile) => matterVFile(vfile, options));
