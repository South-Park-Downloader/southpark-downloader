import configSchema, {ConfigSchema} from './config-schema.js';

type ConfigInput = NestedTransform<ConfigSchema>;

type ConfigDotNotations = DotNotations<ConfigSchema>;

type ConfigKeyNotations = KeyNotations<ConfigSchema>;

type ConfigGetReturnType<K extends DotNotation> = Exclude<
  DotValue<ConfigSchema, K>,
  undefined
> | null;

export default class Config {
  private constructor(
    /**
     * Contains the parsed input data.
     */
    readonly parsed: ConfigSchema
  ) {
    //
  }

  /**
   * Static factory method to create a new Config instance
   * from the provided ConfigInput data.
   */
  static async parse(input: ConfigInput): Promise<Config> {
    /* Initialize the Config object */
    const instance = new Config(
      /* Parse the provided input data */
      await configSchema.parseAsync(input)
    );

    return instance;
  }

  test() {
    const a = this.get('app.debug');
    const b = a;

    const c = this.access(this.parsed, ['app', 'debug']);
    const d = c;
  }

  /**
   * This method retrieves a value from the resolved configuration.
   *
   * @param key The key in dot.notation as defined in ConfigSchema / configSchema.
   * @param fallback The value to return in case the configuration variable is undefined.
   */
  get<K extends ConfigDotNotations>(
    key: K,
    fallback: ConfigGetReturnType<K> = null
  ): ConfigGetReturnType<K> {
    /* Convert the provided "dot.notation" to keys */
    const keys = this.splitDotNotation(key);

    /* Access the value from the parsed config using the keys */
    const result = this.access(this.parsed, keys);

    /* Determine if there was a result */
    if (result !== undefined) {
      return result;
    } else {
      /* Return the fallback value to prevent undefined */
      return fallback;
    }
  }

  /**
   * This method does format and return the provided "dot.notation" to key notation.
   */
  private splitDotNotation<K extends ConfigDotNotations>(
    path: K
  ): DotToKeyNotation<ConfigSchema, K> {
    return path.split('.') as DotToKeyNotation<ConfigSchema, K>;
  }

  /**
   * This method does access the provided object via the provided key notation.
   * @param obj
   * @param keys
   * @returns
   */
  private access<O extends GenericRecord, K extends KeyNotations<O>>(
    obj: O,
    keys: K
  ): KeyValue<O, K> {
    /* Ensure that keys have been provided */
    if (keys.length) {
      /* Get and remove the first key */
      const key = keys.shift();

      /* Ensure that the key maps to a property on the provided object */
      if (key in obj) {
        /* Get the value for the current key */
        const value = obj[key];

        /* There are more keys, access the next object */
        return this.access(value, keys);
      } else {
        throw new Error(
          `Could not find property for provided config key "${key.toString()}".`
        );
      }
    } else {
      /* No keys are remaining, obj is the result */
      return obj;
    }
  }
}
