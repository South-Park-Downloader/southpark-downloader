import {z} from 'zod';

const envSchema = {
  /* Global configuration */
  DEBUG: z
    .boolean()
    .default(false)
    .optional()
    .describe('Enables the debug mode.'),

  /* SouthParkDL configuration */
  SOUTHPARK_DL_NAME: z
    .string()
    .default('spdl')
    .describe('Defines the name of the cli application.'),
  SOUTHPARK_DL_DEFAULT_LANGUAGE: z
    .union([z.literal('de'), z.literal('en')])
    .default('de')
    .describe('Defines the language of the downloaded content. '),
  SOUTHPARK_DL_DATA_DIR: z
    .string()
    .default('~/.spdl/data')
    .describe('Path to the data directory. Episodes will be saved here.'),

  /* YouTubeDL configuration */
  YOUTUBE_DL_BIN: z
    .string()
    .default('/usr/local/bin/youtube-dl')
    .describe('Path to the YouTube DLP binary.'),

  /* FFMPEG configuration */
  FFMPEG_DIR: z
    .string()
    .default('/usr/local/bin')
    .describe(
      'Path to the directory that does contain FFMPEG for YouTube DLP.'
    ),
};

export type EnvSchema = typeof envSchema;

export default envSchema;
