import {DotenvParseOutput, parse} from 'dotenv';
import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';
import {cwd} from 'process';
import {boolean, z} from 'zod';

type ConstantCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${ConstantCase<Rest>}`
  : S;

/**
 * Defines the Schema of the environment variables.
 *
 * **Note:** This have to be defined as snake_case
 */
const configSchema = z.object({
  foo: z.boolean().default(false).optional().describe('This is a bool.'),
  bar: z.string().default('spdl').describe('This is a string.'),
  baz_bal: z.string().default('spdl').describe('This is a string.'),
});

type ConfigSchema = z.infer<typeof configSchema>;

type ConfigInput = {
  [K in keyof ConfigSchema]: string;
};

export default class Config {
  /**
   * Contains the parsed input data.
   */
  private parsed: ConfigSchema;

  constructor(input: ConfigInput) {
    /* Parse the provided input data */
    this.parsed = configSchema.parse(input);
  }

  /**
   * This method retrieves a value from the resolved configuration.
   *
   * @param key The key as defined in ConfigSchema / configSchema.
   * @param fallback The value to return in case the configuration variable is not set.
   * @returns any
   * z.infer<ConfigSchema[K]>
   */
  get<K extends keyof ConfigSchema>(
    key: K,
    fallback: Exclude<ConfigSchema[K] | null, undefined> = null
  ) {
    /* Determine if the provided key exists in the parsed schema */
    if (key in this.parsed) {
      /* Do not return undefined in case of an optional variable without an default value, use fallback instead */
      if (this.parsed[key] !== undefined) {
        /* Return the parsed / default value */
        return this.parsed[key];
      }
    }

    /* Use the fallback value to ensure we return anything */
    return fallback;
  }
}

export type EnvParseOutput = {
  /* Handle properties that should not become optional */
  [K in keyof ConfigSchema as ConfigSchema[K] extends z.ZodOptional<any>
    ? never
    : ConstantCase<K>]: string;
} & {
  /* Handle properties that should not become optional */
  [K in keyof ConfigSchema as ConfigSchema[K] extends z.ZodOptional<any>
    ? ConstantCase<K>
    : never]?: string;
} & DotenvParseOutput;

/* Resolve the path to the .env file */
const envPath = resolve(cwd(), '.env');

/* Parse the .env file */
const parsed = parse<EnvParseOutput>(
  existsSync(envPath) ? readFileSync(envPath) : ''
);

/* Convert parsed CONSTANT_CASE keys to snake_case */
const transformed = Object.keys(parsed).reduce((acc, key) => {
  acc[key as keyof ConfigInput] = parsed[key];
  return acc;
}, {} as ConfigInput);

/* Initialize the Env singleton */
const config = new Config(transformed);

/* This should be boolean | null */
const foo = config.get('foo'); // => string | boolean |null

/* This should be string | null */
const bar = config.get('bar'); // => string | boolean |null
