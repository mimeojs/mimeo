import html from "rehype-stringify";
import extract from "remark-extract-frontmatter";
import frontmatter from "remark-frontmatter";
import markdown from "remark-parse";
import markdown2html from "remark-rehype";
import { mergeMap } from "rxjs/operators";
import { parse as toml } from "toml";
import unified from "unified";
import { VFile, VFileCompatible } from "vfile";
import { parse as yaml } from "yaml";

const transformer = unified()
  .use(frontmatter, ["yaml", "toml"])
  .use(extract, { yaml, toml, throws: true })
  .use(markdown)
  .use(markdown2html)
  .use(html);

/**
 * Transforms VFile using processor
 * @param processor unified processor
 */
export const markdown2Html = (processor = transformer) =>
  mergeMap<VFileCompatible, Promise<VFile>>(async (vfile) =>
    processor.process(vfile)
  );
