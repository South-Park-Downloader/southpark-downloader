import { TDatabaseSymbol } from '../ioc/types.js';
import Database from '../south-park/database.js';
import Command from './abstracts/command.js';

export default class Download extends Command {

  public name: string = 'download';

  public description: string = 'Downloads episodes.'

  public args: { [name: string]: { type: string, description?: string } } = {
    filter: { 
      type: 'string',
      description: 'Filter episodes to be downloaded. Example: "S1E1", "S1E1-E10", "S1E1,S1E2-E10", "S2E3", "S1-S2", ...'
    }
  };

  /**
   * Execute the command.
   */
  public async execute(): Promise<void> {
    console.log('This is the download command!')
    const episodes = this.container.get<Database>(TDatabaseSymbol).getEpisodes();
    const seasons = episodes.map(episode => episode.season)
      .filter((season, index, seasons) => seasons.indexOf(season) === index);
    console.log(`Database has ${seasons.length} episodes and ${episodes.length} episodes`);
  }
}
