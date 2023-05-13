import {Container as InversifyJS} from 'inversify';
import {TContainerSymbol, TProviderManagerSymbol} from './types.js';
import ProviderManager from './provider-manager.js';

export class Container extends InversifyJS {
  async register(): Promise<void> {
    /* Bind the Container itself first for conveniance */
    this.bind<Container>(TContainerSymbol).toConstantValue(this);

    /* Bind the ProviderManager as the core manager of modular IoC */
    this.bind<ProviderManager>(TProviderManagerSymbol)
      .to(ProviderManager)
      .inSingletonScope();
  }

  async boot(): Promise<void> {
    /* Boot all Providers in order to boot the system */
    this.get<ProviderManager>(TProviderManagerSymbol).boot();
  }
}

const container = new Container();
export default container;
