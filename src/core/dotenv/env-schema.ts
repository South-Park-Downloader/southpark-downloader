import {z} from 'zod';

const envSchema = {
  /* Global configuration */
  DEBUG: z.boolean().optional(),

  /* SouthParkDL configuration */
  SOUTHPARK_DL_NAME: z
    .string()
    .default('spdl')
    .describe('Defines the name of the cli application.'),
  SOUTHPARK_DL_DEFAULT_LANGUAGE: z
    .union([z.literal('de'), z.literal('en')])
    .describe('Defines the language of the downloaded content. '),
  SOUTHPARK_DL_DATA_DIR: z
    .string()
    .describe('Path to the data directory. Episodes will be saved here.'),

  /* YouTubeDL configuration */
  YOUTUBE_DL_BIN: z.string().describe('Path to the YouTube DLP binary.'),

  /* FFMPEG configuration */
  FFMPEG_DIR: z.string().describe('Path to the FFMPEG for YouTube DLP binary.'),
};

export type EnvSchema = typeof envSchema;

export default envSchema;
