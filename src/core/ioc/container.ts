import {Container as InversifyJS} from 'inversify';
import ProviderManager from './provider-manager.js';
import ProviderManagerSymbol from '../symbols/ProviderManagerSymbol.js';

export class Container extends InversifyJS {
  async register(): Promise<void> {
    /* Bind the ProviderManager as the core manager of modular IoC */
    this.bind<ProviderManager>(ProviderManagerSymbol)
      .to(ProviderManager)
      .inSingletonScope();
  }

  async boot(): Promise<void> {
    /* Boot all Providers in order to boot the system */
    this.get<ProviderManager>(ProviderManagerSymbol).boot();
  }
}

const container = new Container();
export default container;
