import {DotenvParseOutput} from 'dotenv';

export type EnvParseOutput = {
  /* Handle properties that should not become optional */
  [K in keyof EnvDef as EnvDef[K] extends boolean | false ? never : K]: string;
} & {
  /* Handle properties that should not become optional */
  [K in keyof EnvDef as EnvDef[K] extends boolean | false ? K : never]?: string;
} & DotenvParseOutput;
