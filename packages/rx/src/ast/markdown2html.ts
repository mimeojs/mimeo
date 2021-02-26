import html from "rehype-stringify";
import markdown from "remark-parse";
import markdown2html from "remark-rehype";
import { mergeMap } from "rxjs/operators";
import unified from "unified";
import { VFile, VFileCompatible } from "vfile";

const transformer = unified().use(markdown).use(markdown2html).use(html);

/**
 * Transforms VFile using processor
 * @param processor unified processor
 */
export const markdown2Html = (processor = transformer) =>
  mergeMap<VFileCompatible, Promise<VFile>>(async (vfile) =>
    processor.process(vfile)
  );
