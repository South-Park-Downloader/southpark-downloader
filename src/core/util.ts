import {BaseEncodingOptions, PathLike} from 'fs';
import {lstat, readdir} from 'fs/promises';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

/* Declare default readDir options type as dedicated type so we can easily refer to it */
declare type ReaddirOptions =
  | (BaseEncodingOptions & {
      withFileTypes?: false | undefined;
    })
  | BufferEncoding
  | null
  | undefined;

/**
 * Recursive wrapper for readDir (async).
 */
export async function readdirRecursive(
  path: PathLike,
  options?: ReaddirOptions
): Promise<string[]> {
  /* Read path and get all children as absolute paths */
  const children = (await readdir(path, options)).map(child =>
    resolve(path.toString(), child)
  );

  /* Get directories from children */
  const childDirectories = await filter(children, async child =>
    (await lstat(child)).isDirectory()
  );

  /* Parallel recurse into directories and flatten results */
  const results = (
    await Promise.all(
      childDirectories.map(childDirectory => readdirRecursive(childDirectory))
    )
  ).flat();

  /* Add results to children */
  children.push(...unique(results));

  /* Return collected children */
  return children;
}

/**
 * Given "import.meta.url" as an argument this helper
 * will return the directory of the calling script file.
 * This is an ES Modules replacement for __dirname.
 *
 * {@link https://stackoverflow.com/a/50053801 StackOverflow}
 */
export function scriptDir(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Returns the directory where the application code does reside.
 */
export function appDir(): string {
  return resolve(scriptDir(import.meta.url), '..');
}

/**
 * Returns the directory where the application configuration does reside.
 */
export function configDir(): string {
  return resolve(process.env.HOME || '~', '.spdl');
}

/**
 * Remove duplicate values from an array by checking the index.
 */
export function unique<T>(array: T[]): T[] {
  return array.filter(
    (element: T, index: number) => array.indexOf(element) === index
  );
}

export async function filter<T>(
  array: T[],
  callback: (element: T) => Promise<boolean>
): Promise<T[]> {
  /* Use new symbol as error value so we can use array with any value */
  const failed = Symbol();

  /* Create promises for all elements with the given callback */
  const promises = array.map(async element =>
    (await callback(element)) ? element : failed
  );

  /* Await all promises, filter out failed and return finished result */
  return (await Promise.all(promises)).filter(
    result => result !== failed
  ) as T[];
}

export function keys<T>(o: T): Array<keyof T> {
  return Object.keys(o as object) as Array<keyof T>;
}
