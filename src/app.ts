import { Command as Commander } from 'commander';
import Command from './commands/abstracts/command';
import { resolve } from 'path';
import { Container, injectable } from 'inversify';
import { mkdir } from 'fs/promises';
import { configDir, readdirRecursive, scriptDir } from './util.js';
import { TAppSymbol, TCommanderSymbol, TDatabaseSymbol } from './ioc/types.js';
import Database from './south-park/database.js';

@injectable()
export default class App {
  private container: Container;

  constructor() {
    this.container = new Container();
  }

  /**
   * Initializes and starts a new App instance handling register and boot.
   * @returns The new, booted App instance.
   */
  static async make(): Promise<App> {
    const instance = new App();

    /* Register IoC bindings first */
    await instance.register();

    /* Load / Initialize IoC bindings */
    await instance.boot();

    return instance;
  }

  async register(): Promise<void> {
    /* Create application directory structure */
    await mkdir(configDir(), {recursive: true});

    /* Bind this App */
    this.container.bind<App>(TAppSymbol).toConstantValue(this);

    /* Register the Database */
    this.container.bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();

    /* Initialize and bind CommanderJS */
    this.container.bind<Commander>(TCommanderSymbol).toConstantValue(new Commander());
  }

  async boot(): Promise<void>  {
    /* Load the local database file */
    await this.container.get<Database>(TDatabaseSymbol).load();

    /* Load existing commands */
    await this.loadCommands();
  }

  /**
   * Parse the CLI inputs and run the application / command.
   * @returns The commander instance
   */
  parse(): Commander {
    return this.container.get<Commander>(TCommanderSymbol).parse();
  }

  /**
   * Loads the existing commands and registers them to the
   * CommanderJS instance bound to this App container.
   */
  private async loadCommands(): Promise<void> {
    /* Gather all command files */
    const files = (await readdirRecursive(resolve(scriptDir(import.meta.url), 'commands')))
      .filter(path => path.endsWith('.ts'))
      .filter(path => !path.includes('abstracts'))
      .filter(path => !path.includes('interfaces'))

    console.debug(`Loaded ${files.length} command file paths`);
    
    /* Try to load all files as commands */
    for (const file of files) {
      console.debug(`Importing file ${file}...`);

      /* Dynamically import the TypeScript file */
      const {default: commandConstructor}: {default: new () => Command} = await import(file);

      /* Instantiate command to read it's properties */
      console.debug(`Import successfull! Instancing command...`);
      const command = new commandConstructor();

      /* Create builder fluent and apply the Command's name and description */
      console.debug('Configuring command information...');
      const builder = this.container.get<Commander>(TCommanderSymbol).command(command.name)
        .description(command.description);
      
      /* Apply all Command arguments to the builder */
      console.debug('Configuring command arguments...');
      for (const [name, {description, defaultValue}] of Object.entries(command.args)) {
        builder.argument(name, description, defaultValue);
      }

      /* Apply all Command options to the builder */
      console.debug('Configuring command options...');
      for (const [flags, {description, defaultValue}] of Object.entries(command.options)) {
        builder.option(flags, description, defaultValue)
      }
    }
  }
}
