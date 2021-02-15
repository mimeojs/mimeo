import html from "rehype-stringify";
import extract from "remark-extract-frontmatter";
import frontmatter from "remark-frontmatter";
import markdown from "remark-parse";
import markdown2html from "remark-rehype";
import { mergeMap } from "rxjs/operators";
import { parse as toml } from "toml";
import unified from "unified";
import { VFileCompatible } from "vfile";
import { parse as yaml } from "yaml";

const processor = unified()
  .use(frontmatter, ["yaml", "toml"])
  .use(extract, { yaml, toml, throws: true })
  .use(markdown)
  .use(markdown2html)
  .use(html);

  mergeMap<VFileCompatible, Promise<VFileCompatible>>(async (vfile) => {
    // process to VFile
    const processed = await processor.process(vfile);
    // destruct from processed
    const { data, contents: html } = processed;
    // set contents to stringified JSON
    processed.contents = JSON.stringify({ data, html });
    // return processed VFile
    return processed;
  });
