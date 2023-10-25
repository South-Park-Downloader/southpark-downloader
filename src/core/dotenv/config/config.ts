import configSchema, {ConfigSchema} from './config-schema.js';

type ConfigInput = NestedTransform<ConfigSchema>;

type ConfigDotNotations = DotNotations<ConfigSchema>;

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

  /**
   * This method retrieves a value from the resolved configuration.
   *
   * @param key The key in dot.notation as defined in ConfigSchema / configSchema.
   * @param fallback The value to return in case the configuration variable is undefined.
   */
  get<K extends ConfigDotNotations>(
    key: K,
    fallback: Exclude<DotValue<ConfigSchema, K> | null, undefined> = null
  ): DotValue<ConfigSchema, K> {
    /* Split the key provided in "dot.notation" */
    const keys = this.splitDotNotation(key);

    /* Retrieve the value from the parsed configuration */
    const result = this.access(this.parsed, keys);

    /* Return the result or the fallback value in case result is undefined */
    return result === undefined ? fallback : result;
  }

  /**
   * This helper method does split the provided "dot.notation" path.
   */
  private splitDotNotation<K extends ConfigDotNotations>(
    path: K
  ): DotToKey<ConfigSchema, K> {
    return path.split('.') as DotToKey<ConfigSchema, K>;
  }

//  /**
//   * This helper method does access the parsed configuration
//   * and return the value for the provided array of keys.
//   */
//  private access<O extends GenericRecord, K extends keyof O>(
//    obj: O,
//    keys: string[]
//  ):  {
//    /* Ensure that keys have been provided */
//    if (keys.length) {
//      /* Get and remove the first key */
//      const key = keys.shift() as K;
//
//      /* Determine if the object contains the key */
//      if (key in obj) {
//        /* Get the value for the current key */
//        const value = obj[key];
//
//        /* Determine if this is the last key */
//        if (keys.length > 0) {
//          /* This is the last key, value is the result */
//          return value;
//        } else {
//          /* There are more keys, access the next object */
//          return this.access(value, keys);
//        }
//      }
//    }
//
//    /* Return undefined in case nothing could be returned */
//    return undefined;
//  }

  private access<O extends GenericRecord, K extends DotToKey<O, ConfigDotNotations>>(
    obj: O,
    keys: K
  ): K extends [infer First, ...infer Rest]
    ? First extends keyof O
      ? Rest extends DotToKey<O[First], DotNotations<O[First]>>
        ? Config["access"]<O[First], Rest>
        : never
      : never
    : O {
    const [first, ...rest] = keys;

    if (!first || typeof first !== "string") return obj;

    const nextLevel = obj[first as keyof O];

    if (rest.length === 0 || !nextLevel) return nextLevel;

    return this.access(nextLevel, rest as any);
  }

  test() {
    const a = this.get('app.debug');
    const b = a;
  }
}
