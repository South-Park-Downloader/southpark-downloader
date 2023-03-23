import container, { Container } from '../../ioc/container.js';
import { OptionValues } from 'commander';
import Commander from '../../commander.js';
import App from '../../app.js';
import { TAppSymbol, TCommanderSymbol } from '../../ioc/types.js';

export default abstract class Command {
  /**
   * The name of the command.
   */
  public abstract name: string;

  /**
   * The description of the command.
   */
  public abstract description: string;

  /**
   * The arguments of the command.
   */
  public args: Arguments = {};

  /**
   * The options of the command.
   */
  public options: Options = {};

  /**
   * Reference to the Container.
   */
  protected container: Container;

  /**
   * Initialize the command and set the container property.
   */
  constructor() {
    this.container = container;
  }

  public build(): Commander
  {
    console.debug(`Instancing command...`);
    /* Initialize and configure basic information */
    const command = new Commander(this.name);
    command.description(this.description);
    
    /* Apply all Command arguments to the builder. */
    console.debug('Configuring command arguments...');
    for (const [name, {description, defaultValue}] of Object.entries(this.args)) {
      command.argument(name, description ?? '', defaultValue);
    }

    /* Apply all Command options to the builder. */
    console.debug('Configuring command options...');
    for (const [flags, {description, defaultValue}] of Object.entries(this.options)) {
      command.option(flags, description, defaultValue)
    }

    /* Register the commands execute as it's action. */
    command.action(() => this.execute(this.container.get<Commander>(TCommanderSymbol).args, this.container.get<Commander>(TCommanderSymbol).opts()));

    return command;
  }

  /**
   * Execute the command.
   */
  public abstract execute(args: string[], options: OptionValues): Promise<void>;
}
