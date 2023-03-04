import 'reflect-metadata';
import Database from './south-park/database.js';
import {TAppSymbol, TDatabaseSymbol} from './ioc/types.js';
import App from './app.js';
import { mkdir } from 'fs/promises';
import { configDir } from './util.js';

/* Wrap bootstrap in top-level async to provide await synthax with all module systems */
(async () => {
  /*  Make sure important paths exist */
  console.debug('Creating directory structure...');
  await Promise.all([
    mkdir(configDir(), {recursive: true})
  ]);

  /* Boot the InversifyJS IoC container */
  console.debug('Booting IoC container...');
  const {default: container} = await import('./ioc/container.js');

  /* Bind the App instance */
  console.debug('Binding App instance in IoC...');
  container.bind<App>(TAppSymbol).to(App).inSingletonScope();

  /* Bind and load the episode Database */
  console.debug('Binding Database instance in IoC...');
  container.bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();
  console.log('Loading database.json...');
  await container.get<Database>(TDatabaseSymbol).load();

  /* Load Commands */
  console.debug('Loading available commands...');
  await container.get<App>(TAppSymbol).loadCommands();

  /* Parse and run commands */
  console.debug('All done! Running the App...');
  container.get<App>(TAppSymbol).parse();
})();
