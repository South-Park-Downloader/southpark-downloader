import 'reflect-metadata';
import App from './app.js';

/* Wrap bootstrap in top-level async to provide await synthax with all module systems */
(async () => {
  /* Initialize a new, booted App instance */
  const app = await App.make();

  /* Parse and run commands */
  app.parse();
})();
