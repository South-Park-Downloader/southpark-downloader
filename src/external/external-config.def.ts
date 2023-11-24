import {z} from 'zod';
import ConfigDef from '../core/configuration/config-definition.js';

export default class ExternalConfigDef extends ConfigDef {
  name = 'external';
  schema = z.object({
    youtube_dl: z
      .object({
        bin: z
          .string()
          .default('/usr/local/bin/youtube-dl')
          .describe('Path to the YouTube DLP binary.'),
      })
      .describe('Contains the configuration for the YouTube DL(P) software.'),
    ffmpeg: z
      .object({
        dir: z
          .string()
          .default('/usr/local/bin')
          .describe(
            'Path to the directory that does contain FFMPEG for YouTube DLP.'
          ),
      })
      .describe(
        'Contains the configuration for the FFMPEG (for Youtube DLP) software.'
      ),
  });
}
