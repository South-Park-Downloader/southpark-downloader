import container, { Container } from '../../ioc/container.js';
import Commander from '../../commander.js';
import { keys } from '../../util.js';
import { OptionValues } from 'commander';

export default abstract class Command<Args extends Arguments = {}, Opts extends Options = {}> {
  /**
   * The name of the command.
   */
  public abstract name: string;

  /**
   * The description of the command.
   */
  public abstract description: string;

  /**
   * The commands arguments definitions.
   */
  public args: Args;

  /**
   * The commands Options definitions.
   */
  public opts: Opts;

  /**
   * Reference to the Container.
   */
  protected container: Container;

  /**
   * Initialize the command and set the container property.
   */
  constructor(args: Args, opts: Opts) {
    this.args = args;
    this.opts = opts;

    /* Set container reference from static export */
    this.container = container;
  }

  /**
   * Execute the command.
   */
  public abstract execute(args: Record<keyof Args, string>, options: Record<keyof Opts, unknown>): Promise<void>;

  public build(): Commander<string[], Record<keyof Opts, unknown>>
  {
    console.debug(`Instancing command...`);
    /* Initialize and configure basic information */
    const command = new Commander<string[], Record<keyof Opts, unknown>>(this.name);
    command.description(this.description);
    
    /* Apply all Command arguments to the builder. */
    console.debug('Configuring command arguments...');
    for (const [name, {description, defaultValue}] of Object.entries(this.args)) {
      command.argument(name, description ?? '', defaultValue);
    }

    /* Apply all Command options to the builder. */
    console.debug('Configuring command options...');
    for (const [name, {description, defaultValue, required, short, type, placeholder}] of Object.entries(this.opts)) {
      /* Build the usage from the Command's name and possible short flag */
      let usage = `--${name}`;
      if (short) {
        usage = `-${short}, ${usage}`
      }

      /* Append the value to the usage in case this is a value type option */
      if (type === 'value') {
        usage = `${usage} <${placeholder ?? name}>`;
      }

      if (required) {
        command.requiredOption(usage, description, defaultValue);
      } else {
        command.option(usage, description, defaultValue)
      }
    }

    /* Register the commands action. */
    command.action(() => {
      console.debug(`Processed args: ${command.processedArgs}`);

      console.debug(`Processed opts: ${JSON.stringify(command.opts())}`);
      
      /* Map the argument values to an object using their name as property */
      let mappedArgs = Object.fromEntries(
        command.processedArgs.map((value, index) => [
          keys(command.processedArgs)[index], 
          value
        ])
      ) as Record<keyof Args, string>;

      /* Run the executor */
      this.execute(
        mappedArgs, 
        command.opts()
      );
    });

    return command;
  }
}
