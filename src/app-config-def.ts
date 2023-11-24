import {z} from 'zod';
import ConfigDef from './core/configuration/config-definition.js';

export default class AppConfigDef extends ConfigDef {
  name = 'app';
  schema = z.object({
    language: z
      .union([z.literal('de'), z.literal('en')])
      .optional()
      .default('de')
      .describe('Defines the language of the downloaded content. '),
    data_dir: z
      .string()
      .optional()
      .default('~/.spdl/data')
      .describe('Path to the data directory. Episodes will be saved here.'),
  });
}
