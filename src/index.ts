import { mkdir } from 'fs/promises';
import 'reflect-metadata';
import App from './app.js';
import container from './ioc/container.js';
import { TAppSymbol } from './ioc/types.js';
import { configDir } from './util.js';

/* Wrap bootstrap in top-level async to provide await synthax with all module systems */
(async () => {
  /* Create application directory structure */
  await mkdir(configDir(), {recursive: true});

  /* Initialize the container  and register bindings */
  await container.register();

  /* Boot the container bindings */
  await container.boot();

  /* Parse and run commands */
  container.get<App>(TAppSymbol).parse();
})();
