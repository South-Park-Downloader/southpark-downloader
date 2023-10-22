import env from './env-resolver.js';

export default class Env {
  /**
   * This method retrieves a value from the resolved environment.
   *
   * @param key The key as defined in EnvDef.
   * @param fallback The value to return in case the environment variable is not set.
   * @returns any
   */
  get<K extends keyof EnvDef>(
    key: K,
    fallback: EnvDef[K] | null = null
  ): EnvDef[K] | null {
    /* Determine if the provided key exists in the resolved environment */
    if (key in env) {
      /* Return the value from the resolved environment */
      return env[key];
    } else {
      /* Use the fallback value in case the key does not exist */
      return fallback;
    }
  }

  private parse<K extends keyof EnvDef>(key: K): EnvDef[K] | undefined {
    /* Determine if the provided key exists in the resolved environment */
    if (key in env) {
      /* Get the string input value from DotEnv */
      const input = env[key];

      /* Determine the desired type of the key */
      //

      /* Try to parse the input */
    } else {
      /* Determine if the key is optional */
      if (true) {
        /* Return undefined to allow null as value */
        return undefined;
      } else {
        /* Throw an error in case the requested key is not configured and not optional */
        throw new Error(
          `Could not parse required environment variable "${key}".`
        );
      }
    }

    /* Return undefined in case the key does not exist */
  }
}
