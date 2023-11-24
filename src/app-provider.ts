import {interfaces} from 'inversify';
import AppConfigDef from './app-config-def.js';
import Config from './core/configuration/config.js';
import {Container} from './core/ioc/container.js';
import Provider from './core/ioc/provider.js';
import ConfigSymbol from './core/symbols/ConfigSymbol.js';

export default class SouthParkProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    //
  }

  async boot(container: Container): Promise<void> {
    /* Register the configuration definiton */
    container.get<Config>(ConfigSymbol).register(
      AppConfigDef.
    );
  }
}
