import {DotenvParseOutput} from 'dotenv';
import {z} from 'zod';
import envSchema from '../env-schema.js';

type EnvSchema = typeof envSchema;

export type EnvParseOutput = {
  /* Handle properties that should not become optional */
  [K in keyof EnvSchema as EnvSchema[K] extends z.ZodOptional<any>
    ? never
    : K]: string;
} & {
  /* Handle properties that should not become optional */
  [K in keyof EnvSchema as EnvSchema[K] extends z.ZodOptional<any>
    ? K
    : never]?: string;
} & DotenvParseOutput;
