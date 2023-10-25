import {z} from 'zod';
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
   * @param key The key as defined in EnvSchema / envSchema.
   * @param fallback The value to return in case the environment variable is not set.
   * @returns any
   * z.infer<EnvSchema[K]>
   */
  get<K extends keyof EnvSchema>(
    key: K,
    fallback: Exclude<z.infer<EnvSchema[K]> | null, undefined> = null
  ) {
    /* Determine if the provided key exists in the resolved environment */
    if (key in env) {
      /* Get the schema for the provided environment variable */
      const schema: EnvSchema[K] = envSchema[key];

      /* Try to parse the environment input using the schema */
      const parsed = schema.parse(env[key]);

      /* Do not return undefined in case of an optional variable without an default value, use fallback instead */
      if (parsed !== undefined) {
        /* Return the parsed / default value */
        return parsed;
      }
    }

    /* Use the fallback value to ensure we return anything */
    return fallback;
  }

  foo() {
    const value = this.get('YOUTUBE_DL_BIN'); // => 'string | boolean | null', this should be just 'string | null'
  }
}
