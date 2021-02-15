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

interface Processed extends VFile {
  data: any;
}

const transformer = unified()
  .use(frontmatter, ["yaml", "toml"])
  .use(extract, { yaml, toml, throws: true })
  .use(markdown)
  .use(markdown2html)
  .use(html);

export const transform = (processor = transformer) =>
  mergeMap<VFileCompatible, Promise<VFile>>(async (vfile) => {
    // process to VFile
    const processed = await processor.process(vfile);
    // destruct from processed
    const { data, contents: html }: Processed = processed;
    // set contents to stringified JSON
    processed.contents = JSON.stringify({ ...data, html });
    // return processed VFile
    return processed;
  });
