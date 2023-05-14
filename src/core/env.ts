import {DotenvParseOutput, parse} from 'dotenv';
import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';
import {cwd} from 'process';

/* Do not export the implementation in order to prevent it being constructed */
class EnvImplementation<T extends DotenvParseOutput = DotenvParseOutput> {
  constructor(private output: T) {}

  /**
   * Helper to retrieve values from the
   * environment with strong types.
   */
  get(key: keyof T, def?: any): any {
    /* Check that the key is in the parsed DotEnv output and NOT undefined */
    if (key in this.output && this.output[key] !== undefined) {
      /* Return the value from the parsed DotEnv output */
      return this.output[key];
    }

    /* Return default value in case the key does not exist or is not defined in the parsed DotEnv output */
    return def;
  }
}

/* Define the path to the .env file */
const envPath = resolve(cwd(), '.env');

/* Initialize the singleton the old fassioned way */
const Env = new EnvImplementation(
  /* Define schema and parse using DotEnv */
  parse<{
    /* SouthParkDL configuration */
    SOUTHPARK_DL_NAME: string;

    /* YouTubeDL configuration */
    YOUTUBE_DL_BIN: string;

    /* FFMPEG configuration */
    FFMPEG_BIN: string;
  }>(existsSync(envPath) ? readFileSync(envPath) : '')
);

/* Export the singleton instance */
export default Env;
