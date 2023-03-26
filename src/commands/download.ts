import { TDatabaseSymbol } from '../ioc/types.js';
import Database from '../south-park/database.js';
import Filter from '../south-park/filtering/filter.js';
import Command from './abstracts/command.js';

export const Arguments = {};

export const Options: {
  filters: OptionDefinition
} = {
  filters: {
    short: 'f',
    description: 'Filter episodes to be downloaded. Example: "S1E1", "S1E1-E10", "S1E1,S1E2-E10", "S2E3", "S1-S2", ...',
  }
};

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
    console.log('This is the download command!');
    console.log (`Provided arguments: ${JSON.stringify(args)}`);
    console.log (`Provided options: ${JSON.stringify(options)}`);

    /* Initialize filters if provided */
    const filters: Filter[] = [];
    if (options.filters) {
      console.log(`Provided filters string "${options.filters}".`);
      (options.filters as string).split(',').forEach(filterString => filters.push(new Filter(filterString)));
    }

    /* Get the episodes from the database */
    const episodes = this.container.get<Database>(TDatabaseSymbol).getEpisodes(filters);

    /* Group the episodes by their season */
    const sorted = episodes.group(({season}) => season) as { [season: string]: Episode[] };

    return;

//    /* Print the episodes that would be downloaded */
//    console.log(`The following episodes will be downloaded:`);
//    for (const [season, episodes] of Object.entries(sorted)) {
//      /* Print the season index */
//      console.log(`Season ${season}:`);
//
//      /* Print the seasons episodes */
//      for (const episode of episodes) {
//        console.log(`${episodes.indexOf(episode) !== episodes.length - 1 ? '├' : '└'} Episode ${episode.index}: ${episode.languages['de'].name}`);
//      }
//
//      /* Print a spacer between each season */
//      console.log('────────────────────');
//    }
  }
}
