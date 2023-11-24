/**
 * This class represents a singular configuration definition / configuration file.
 */
export default abstract class ConfigDef {
  /**
   * The name of the configuration.
   */
  abstract readonly name: string;

  /**
   * The zod schema of the configuration.
   */
  abstract readonly schema;
}
