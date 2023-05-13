// Polyfills
import 'core-js/actual/array/group.js';

// Normal imports
import bootstrap from './bootstrap.js';

/* Wrap bootstrap in top-level async to provide await synthax with all module systems */
(async () => {
  await bootstrap();
})();
