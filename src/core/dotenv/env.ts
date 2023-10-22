import env from './env-resolver.js';
import envSchema, {EnvSchema} from './env-schema.js';

export default class Env {
  /**
   * This method does validate the environment configuration.
   * It will check the resolved environment inputs agains the
   * defined Zod schema.
   */
  async validate() {
    /* Collect the parse promises so we can parse all properties in parallel */
    const promises = [];

    /* Iterate each environment variable defined in the schema */
    for (const [key, value] of Object.entries(envSchema)) {
      /* Push the promise to the stack */
      promises.push(
        /* Parse the value from the resolved environment */
        value.parseAsync(env[key])
      );
    }

    /* Wait for all parsing to finish */
    await Promise.all(promises);
  }

  /**
   * This method retrieves a value from the resolved environment.
   *
   * @param key The key as defined in EnvDef.
   * @param fallback The value to return in case the environment variable is not set.
   * @returns any
   */
  get<K extends keyof EnvSchema>(
    key: K,
    fallback: EnvSchema[K] | null = null
  ): EnvSchema[K] | null {
    /* Determine if the provided key exists in the resolved environment */
    if (key in env) {
      /* Parse the input using the schema */
      return envSchema[key].parse(env[key])?.valueOf();
    } else {
      /* Use the fallback value in case the key does not exist */
      return fallback;
    }
  }
}
