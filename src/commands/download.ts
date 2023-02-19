import Command from './abstracts/command';

export default class Download extends Command {

  public name: string = 'download';

  public description: string = 'Downloads episodes.'

  public args: { [name: string]: { type: string, description?: string } } = {
    filter: { 
      type: 'string',
      description: 'Filter episodes to be downloaded.'
     }
  };

  /**
   * Execute the command.
   */
  public async execute(): Promise<number|void> {
    console.log('This is the download command!')
  }
}
