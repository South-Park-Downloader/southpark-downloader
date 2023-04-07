import container, { Container } from '../../ioc/container.js';
import Commander from '../../commander.js';
import { keys } from '../../util.js';
import { Arguments, BooleanOptionDefinition, Options, ValueOptionDefinition } from '../../types/command';

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
  public abstract execute(args: Record<keyof Args, string>, options: Record<keyof Opts, Opts[keyof Opts] extends ValueOptionDefinition ? string : true>): Promise<void>;

  public build(): Commander<string[], Record<keyof Opts, Opts[keyof Opts] extends ValueOptionDefinition ? string : true>>
  {
    /* Initialize and configure basic information */
    const command = new Commander<string[], Record<keyof Opts, Opts[keyof Opts] extends ValueOptionDefinition ? string : true>>(this.name);
    command.description(this.description);
    
    /* Apply all Command arguments to the builder. */
    for (const [name, {description, defaultValue}] of Object.entries(this.args)) {
      command.argument(name, description ?? '', defaultValue);
    }

    /* Apply all Command options to the builder. */
    for (const [name, definition] of Object.entries(this.opts)) {
      const {description, required} = definition;

      const args: [
        Commander<string[], Record<keyof Opts, Opts[keyof Opts] extends ValueOptionDefinition ? string : true>>,
        boolean,
        string,
        string?,
        any?
      ] = [
        command,
        required ?? false,
        this.usage(name, definition),
        description
      ];

      if (definition.type === 'value') {
        const {defaultValue} = definition;
        args.push(defaultValue);
      }

      this.registerOption(...args);
    }

    /* Register the commands action. */
    command.action(() => {
      console.debug(`Processed arguments: ${command.processedArgs}`);
      console.debug(`Processed options: ${JSON.stringify(command.opts())}`);
      
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

  /**
   * Helper to build an options usage string.
   */
  private usage(name: string, definition: ValueOptionDefinition | BooleanOptionDefinition): string
  {
    const {short} = definition;
    let usage = `--${name}`;
    if (short) {
      usage = `-${short}, ${usage}`
    }
    if (definition.type === 'value') {
      const {placeholder} = definition;
      usage = `${usage} <${placeholder ?? name}>`;
    }
    return usage;
  }

  
  private registerOption(
    command: Commander<string[], Record<keyof Opts, (Opts[keyof Opts] extends ValueOptionDefinition ? string : true) | undefined>>,
    required: boolean,
    usage: string,
    description?: string, 
    defaultValue?: string
  ): void
  {
    if (required) {
      command.requiredOption(usage, description, defaultValue);
    } else {
      command.option(usage, description, defaultValue)
    }
  }
}
