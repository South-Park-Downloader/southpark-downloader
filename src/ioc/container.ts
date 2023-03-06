import { Container as InversifyJS } from 'inversify';
import App from '../app.js';
import Commander from '../commander.js';
import Database from '../south-park/database.js';
import { TAppSymbol, TCommanderSymbol, TDatabaseSymbol } from './types.js';

export class Container extends InversifyJS {
  async register(): Promise<void> {
    /* Bind App as singleton */
    this.bind<App>(TAppSymbol).to(App).inSingletonScope();

    /* Bind Database as singleton */
    this.bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();

    /* Bind CommanderJS as singleton */
    this.bind<Commander>(TCommanderSymbol).toConstantValue(new Commander());
  }

  async boot(): Promise<void> {
    /* Load the local database file */
    await this.get<Database>(TDatabaseSymbol).load();

    /* Load existing commands */
    await this.get<App>(TAppSymbol).loadCommands();
  }
}

const container = new Container();
export default container;