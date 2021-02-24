import { map } from "rxjs/operators";
import { VFile } from "vfile";

interface Processed extends VFile {
  data: any;
}

/**
 * Serializes vfile contents to
 */
export const compose = () =>
  map<VFile, VFile>((vfile) => {
    const { data, contents: html }: Processed = vfile;
    // set contents to stringified JSON
    vfile.contents = JSON.stringify({ ...data, html });
    // return processed VFile
    return vfile;
  });
