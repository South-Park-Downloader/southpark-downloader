import {interfaces} from 'inversify';
import {Container} from '../core/ioc/container.js';
import Provider from '../core/ioc/provider.js';
import {TDatabaseSymbol, TEpisodeFactorySymbol} from '../core/ioc/types.js';
import Database from './database.js';
import episodeFactory from './episode-factory.js';

export default class SouthParkProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    /* Bind Database as singleton */
    bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();

    /* Register Episode factory */
    bind<ReturnType<typeof episodeFactory>>(TEpisodeFactorySymbol).toFactory(
      episodeFactory
    );
  }

  async boot(container: Container): Promise<void> {
    /* Load the local database file */
    await container.get<Database>(TDatabaseSymbol).load();
  }
}
