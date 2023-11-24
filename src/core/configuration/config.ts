import LogicError from '../error/logic-error.js';
import ConfigDef from './config-definition.js';

/**
 * This class represents the configuration. It is used as
 * a registry for configuration definitions as well as to
 * retrieve configuration values from them.
 */
export default class Config {
  /**
   * Contains the registered configuration definitions.
   */
  private definitions: Array<ConfigDef> = [];

  /**
   * This method registers a new configuration definition.
   * @param definition The configuration definition to register.
   */
  public register(definition: ConfigDef): void {
    /* Check if the name of the provided definition is already claimed */
    if (this.definitions.find(def => def.name === definition.name)) {
      /* Possible configuration conflict caused by logic issues */
      throw new LogicError(
        `Configuration definition "${definition.name}" is already registered.`
      );
    }

    /* Add the provided definition to the registry */
    this.definitions.push(definition);
  }
}
