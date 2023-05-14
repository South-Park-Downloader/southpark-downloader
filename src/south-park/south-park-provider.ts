import {interfaces} from 'inversify';
import {Container} from '../core/ioc/container.js';
import Provider from '../core/ioc/provider.js';
import Database from './database.js';
import episodeFactory from './episode-factory.js';
import DatabaseSymbol from './symbols/DatabaseSymbol.js';
import EpisodeFactorySymbol from './symbols/EpisodeFactorySymbol.js';

export default class SouthParkProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    /* Bind Database as singleton */
    bind<Database>(DatabaseSymbol).to(Database).inSingletonScope();

    /* Register Episode factory */
    bind<ReturnType<typeof episodeFactory>>(EpisodeFactorySymbol).toFactory(
      episodeFactory
    );
  }

  async boot(container: Container): Promise<void> {
    /* Load the local database file */
    await container.get<Database>(DatabaseSymbol).load();
  }
}
