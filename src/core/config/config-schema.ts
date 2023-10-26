import {z} from 'zod';

/**
 * Defines the Schema of the environment variables.
 *
 * **Note:** This have to be defined as snake_case
 */
const configSchema = z.object({
  /**
   * Contains the configuration for the application.
   */
  app: z.object({
    /**
     * Defines if the application is running in debug mode.
     */
    debug: z
      .boolean()
      .default(false)
      .optional()
      .describe('Enables the debug mode.'),

    /**
     * Defines the name of the cli application.
     */
    name: z
      .string()
      .default('spdl')
      .describe('Defines the name of the cli application.'),

    /**
     * Defines the language of the downloaded content.
     */
    language: z
      .union([z.literal('de'), z.literal('en')])
      .default('de')
      .describe('Defines the language of the downloaded content. '),

    /**
     * Defines the path to the data directory.
     */
    data_dir: z
      .string()
      .default('~/.spdl/data')
      .describe('Path to the data directory. Episodes will be saved here.'),
  }),

  /**
   * Contains the configuration for the YouTube DL(P) software.
   */
  youtube_dl: z.object({
    /**
     * Defines the path to the YouTube DLP binary.
     */
    bin: z
      .string()
      .default('/usr/local/bin/youtube-dl')
      .describe('Path to the YouTube DLP binary.'),
  }),

  /**
   * Contains the configuration for the FFMPEG (for Youtube DLP) software.
   */
  ffmpeg: z.object({
    /**
     * Defines the path to the directory that does contain the FFMPEG (for YouTube DLP) binaries.
     */
    dir: z
      .string()
      .default('/usr/local/bin')
      .describe(
        'Path to the directory that does contain FFMPEG for YouTube DLP.'
      ),
  }),
});

/* Export the schema */
export default configSchema;

/* Infer the parsed type from the schema */
export type ConfigSchema = z.infer<typeof configSchema>;
