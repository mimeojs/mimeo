import { GlobbyOptions, sync } from "globby";
import { pipe } from "rxjs";
import { mergeMap, toArray } from "rxjs/operators";

/**
 * Transforms glob patterns to paths
 * @param options Glob options
 */
export const list = (options?: GlobbyOptions) =>
  pipe(
    // collect array of patterns
    toArray<string>(),
    // map and flatten pattern to paths
    mergeMap((pattern) => sync(pattern, options))
  );
