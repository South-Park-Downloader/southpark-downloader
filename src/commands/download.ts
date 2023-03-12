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
    console.log('This is the download command!');

    /* Get the episodes from the database */
    const episodes = this.container.get<Database>(TDatabaseSymbol).getEpisodes();

    /* Group the episodes by their season */
    const sorted = episodes.group(({season}) => season) as { [season: string]: Episode[] };

    /* Print the episodes that would be downloaded */
    console.log(`The following episodes will be downloaded:`);
    for (const [season, episodes] of Object.entries(sorted)) {
      /* Print the season index */
      console.log(`Season ${season}:`);

      /* Print the seasons episodes */
      for (const episode of episodes) {
        console.log(`${episodes.indexOf(episode) !== episodes.length - 1 ? '├' : '└'} Episode ${episode.index}: ${episode.languages['de'].name}`);
      }

      /* Print a spacer between each season */
      console.log('────────────────────');
    }
  }
}
