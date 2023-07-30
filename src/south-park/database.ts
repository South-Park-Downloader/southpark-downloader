import {existsSync, PathLike} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import fetch from 'node-fetch';
import {inject, injectable} from 'inversify';
import {resolve} from 'node:path';
import {configDir} from '../core/util.js';
import Filter from './filtering/filter.js';
import Episode from './episode.js';
import episodeFactory from './episode-factory.js';
import EpisodeFactorySymbol from './symbols/EpisodeFactorySymbol.js';

@injectable()
export default class Database {
  /**
   * The URL to the database.json file, wille be used to load the current database definition from the repository
   */
  public static url =
    'https://raw.githubusercontent.com/South-Park-Downloader/database/main/database.json';

  /**
   * Holds the loaded data of the database.json file.
   */
  private data: EpisodeData = [];

  private factory: ReturnType<typeof episodeFactory>;

  constructor(
    @inject(EpisodeFactorySymbol) factory: ReturnType<typeof episodeFactory>
  ) {
    this.factory = factory;
  }

  getEpisodes(filters: Filter[] = []): Episode[] {
    /* Copy data so we can modify it */
    let data = this.data;

    /* Apply filters in case any have been provided */
    if (filters.length) {
      data = data.filter(episode =>
        filters.find(filter => filter.match(episode))
      );
    }

    /* Map final data to Episode using EpisodeFactory */
    return data.map<Episode>(
      (datum: EpisodeDatum) => this.factory(datum) as Episode
    );
  }

  /**
   * Load the local database.json file and populate the data property.
   * @return Promise<void>
   */
  async load(): Promise<void> {
    if (!existsSync(Database.databasePath())) {
      await Database.sync();
    }

    this.data = JSON.parse(
      (await readFile(Database.databasePath())).toString()
    );
  }

  /**
   * Sync the database.json from the repository.
   * @return Promise<void>
   */
  static async sync(): Promise<void> {
    await fetch(Database.url)
      .then(response => response.json())
      .then(data => writeFile(Database.databasePath(), JSON.stringify(data)));
  }

  /**
   * Defines where the local copy of the database.json relative to the configDir
   */
  private static databasePath(): PathLike {
    return resolve(configDir(), 'database.json');
  }
}
