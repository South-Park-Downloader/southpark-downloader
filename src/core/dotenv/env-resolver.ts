import {parse} from 'dotenv';
import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';
import {cwd} from 'process';
import {EnvParseOutput} from './types/env-def-parse-output.js';

/* Resolve the path to the .env file relative to the working directory */
const envPath = resolve(cwd(), '.env');

/* Initialize the singleton the old fassioned way */
const env = parse<EnvParseOutput>(
  existsSync(envPath) ? readFileSync(envPath) : ''
);

export default env;
