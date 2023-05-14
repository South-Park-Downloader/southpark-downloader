import {interfaces} from 'inversify';
import {Container} from './ioc/container.js';
import Provider from './ioc/provider.js';
import Commander from './commander.js';
import App from './app.js';
import Env from './env.js';
import AppSymbol from './symbols/AppSymbol.js';
import CommanderSymbol from './symbols/CommanderSymbol.js';

export default class CoreProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    /* Bind CommanderJS instance */
    bind<Commander>(CommanderSymbol).toConstantValue(
      new Commander(Env.get('SOUTHPARK_DL_NAME', 'spdl'))
    );

    /* Bind App as singleton */
    bind<App>(AppSymbol).to(App).inSingletonScope();
  }

  async boot(container: Container): Promise<void> {
    /* Load existing commands */
    await container.get<App>(AppSymbol).loadCommands();
  }
}
