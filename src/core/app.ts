import Command from './commands/command.js';
import {resolve} from 'path';
import {inject, injectable} from 'inversify';
import Commander from './commander.js';
import {readdirRecursive, scriptDir} from './util.js';
import CommanderSymbol from './symbols/CommanderSymbol.js';

@injectable()
export default class App {
  private commander: Commander;

  constructor(@inject(CommanderSymbol) commander: Commander) {
    this.commander = commander;
  }
  /**
   * Parse the CLI inputs and run the application / command.
   */
  parse(): Promise<Commander> {
    return this.commander.parseAsync(process.argv);
  }

  /**
   * Loads the existing commands and registers them to the
   * CommanderJS instance bound to this App container.
   */
  async loadCommands(): Promise<void> {
    /* Gather all command files */
    const files = (
      await readdirRecursive(resolve(scriptDir(import.meta.url), '../commands'))
    )
      .filter(path => path.endsWith('.ts'))
      .filter(path => !path.includes('abstracts'))
      .filter(path => !path.includes('interfaces'));

    /* Try to load all files as commands. */
    for (const file of files) {
      /* Dynamically import the TypeScript file. */
      const {default: Constructor}: {default: new () => Command} = await import(
        file
      );

      /* Initialize and add the command. */
      this.commander.addCommand(new Constructor().build());
    }
  }
}
