import {interfaces} from 'inversify';
import {Container} from './ioc/container.js';
import Provider from './ioc/provider.js';
import Commander from './commander.js';
import {TAppSymbol, TCommanderSymbol} from './ioc/types.js';
import App from './app.js';
import Env from './env.js';

export default class CoreProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    /* Bind CommanderJS instance */
    bind<Commander>(TCommanderSymbol).toConstantValue(
      new Commander(Env.get('SOUTHPARK_DL_NAME', 'spdl'))
    );

    /* Bind App as singleton */
    bind<App>(TAppSymbol).to(App).inSingletonScope();
  }

  async boot(container: Container): Promise<void> {
    /* Load existing commands */
    await container.get<App>(TAppSymbol).loadCommands();
  }
}
