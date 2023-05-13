// Important Imports
import 'reflect-metadata';

// Normal imports
import {mkdir} from 'fs/promises';
import {configDir} from './core/util.js';
import container from './core/ioc/container.js';
import App from './core/app.js';
import {TAppSymbol, TProviderManagerSymbol} from './core/ioc/types.js';
import ProviderManager from './core/ioc/provider-manager.js';
import CoreProvider from './core/core-provider.js';
import ExternalProvider from './external/external-provider.js';
import SouthParkProvider from './south-park/south-park-provider.js';

export default async function bootstrap(): Promise<void> {
  /*         *\
  |  Prepare  |
  \*         */
  /* Create application directory structure */
  await mkdir(configDir(), {recursive: true});

  /*            *\
  |  Initialize  |
  \*            */
  /* Initialize the InversifyJS container */
  await container.register();

  /* Add all Providers */
  container.get<ProviderManager>(TProviderManagerSymbol).add(CoreProvider);
  container.get<ProviderManager>(TProviderManagerSymbol).add(ExternalProvider);
  container.get<ProviderManager>(TProviderManagerSymbol).add(SouthParkProvider);

  /* Register all available providers */
  await container.get<ProviderManager>(TProviderManagerSymbol).register();

  /* Boot all registered providers */
  await container.get<ProviderManager>(TProviderManagerSymbol).boot();

  /*     *\
  |  Run  |
  \*     */
  /* Parse and run commands */
  await container.get<App>(TAppSymbol).parse();
}
