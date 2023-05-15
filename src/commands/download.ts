import Database from '../south-park/database.js';
import Filter from '../south-park/filtering/filter.js';
import {ValueOptionDefinition} from '../core/types/cli.js';
import Command from '../core/commands/command.js';
import DatabaseSymbol from '../south-park/symbols/DatabaseSymbol.js';
import Downloader from '../south-park/download/downloader.js';
import Episode from '../south-park/episode.js';
import DownloaderSymbol from '../south-park/symbols/DownloaderSymbol.js';

export const Arguments = {};

export const Options: {
  filter: ValueOptionDefinition;
} = {
  filter: {
    type: 'value',
    placeholder: 'filter-strings',
    description:
      'Filter episodes to be downloaded. Example: "S1E1", "S1E1-E10", "S1E1,S1E2-E10", "S2E3", "S1-S2", ...',
    short: 'f',
  },
};

export default class Download extends Command<
  typeof Arguments,
  typeof Options
> {
  public name = 'download';

  public description = 'Downloads episodes.';

  constructor() {
    super(Arguments, Options);
  }

  /**
   * Execute the command.
   */
  public async execute(
    args: Record<keyof typeof Arguments, string>,
    options: Record<
      keyof typeof Options,
      (typeof Options)[keyof typeof Options] extends ValueOptionDefinition
        ? string
        : true
    >
  ): Promise<void> {
    /* Initialize filters if provided */
    const filters: Filter[] = [];
    if (options.filter) {
      console.log(`Provided filters string "${options.filter}".`);
      options.filter
        .split(',')
        .forEach(filterString => filters.push(new Filter(filterString)));
    }

    /* Get the episodes from the database */
    const episodes = this.container
      .get<Database>(DatabaseSymbol)
      .getEpisodes(filters);

    /* Group the episodes by their season */
    const sorted = episodes.group(({datum: {season}}) => season) as {
      [season: string]: Episode[];
    };

    /* Print the episodes that would be downloaded */
    console.log('The following episodes will be downloaded:');
    for (const [season, episodes] of Object.entries(sorted)) {
      /* Print the season index */
      console.log(`Season ${season}:`);

      /* Print the seasons episodes */
      for (const episode of episodes) {
        console.log(
          `${
            episodes.indexOf(episode) !== episodes.length - 1 ? '├' : '└'
          } Episode ${episode.datum.index}: ${
            episode.datum.languages['de'].name
          }`
        );
      }

      /* Print a spacer between each season */
      console.log('────────────────────');
    }

    /* Actually download the episodes */
    this.container.get<Downloader>(DownloaderSymbol).process(episodes);
  }
}
