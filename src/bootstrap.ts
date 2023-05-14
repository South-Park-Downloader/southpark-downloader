/* Important Imports */
import 'reflect-metadata';

/* Normal imports */

import {mkdir} from 'fs/promises';
import {configDir} from './core/util.js';
import container from './core/ioc/container.js';
import App from './core/app.js';
import ProviderManager from './core/ioc/provider-manager.js';
import CoreProvider from './core/core-provider.js';
import ExternalProvider from './external/external-provider.js';
import SouthParkProvider from './south-park/south-park-provider.js';
import ProviderManagerSymbol from './core/symbols/ProviderManagerSymbol.js';
import AppSymbol from './core/symbols/AppSymbol.js';

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
  container.get<ProviderManager>(ProviderManagerSymbol).add(CoreProvider);
  container.get<ProviderManager>(ProviderManagerSymbol).add(ExternalProvider);
  container.get<ProviderManager>(ProviderManagerSymbol).add(SouthParkProvider);

  /* Register all available providers */
  await container.get<ProviderManager>(ProviderManagerSymbol).register();

  /* Boot all registered providers */
  await container.get<ProviderManager>(ProviderManagerSymbol).boot();

  /*     *\
  |  Run  |
  \*     */
  /* Parse and run commands */
  await container.get<App>(AppSymbol).parse();
}
