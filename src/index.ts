import Database from './south-park/database.js';
import {TDatabaseSymbol} from './ioc/types.js';

/* Wrap bootstrap in top-level async to provide await synthax with all module systems */
(async () => {
  /* Boot the IoC container */
  const {default: container} = await import('./ioc/container.js');

  /* Bind and load the episode Database */
  container.bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();
  await container.get<Database>(TDatabaseSymbol).load();
})();
