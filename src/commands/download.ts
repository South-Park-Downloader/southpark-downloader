import { OptionValues } from 'commander';
import { TDatabaseSymbol } from '../ioc/types.js';
import Database from '../south-park/database.js';
import Filter from '../south-park/filtering/filter.js';
import Command from './abstracts/command.js';

export const Arguments: {
  myArg: ArgumentDefinition
} = {
  myArg: { 
    description: 'Filter episodes to be downloaded. Example: "S1E1", "S1E1-E10", "S1E1,S1E2-E10", "S2E3", "S1-S2", ...'
  }
};

export const Options = {};

export default class Download extends Command<typeof Arguments, typeof Options> {

  public name: string = 'download';

  public description: string = 'Downloads episodes.'

  constructor() {
    super(Arguments, Options);
  }

  /**
   * Execute the command.
   */
  public async execute(args: Record<keyof typeof Arguments, string>, options: Record<keyof typeof Options, string | number | boolean>): Promise<void>
  {
    // Todo
  }
}
