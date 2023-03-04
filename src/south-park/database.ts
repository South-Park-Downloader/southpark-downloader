import { existsSync, PathLike } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import fetch from 'node-fetch';
import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { configDir } from '../util.js';

@injectable()
export default class Database {
  /**
   * The URL to the database.json file, wille be used to load the current database definition from the repository
   */
  public static url =
    'https://raw.githubusercontent.com/bumbummen99/southpark-downloader/database/database.json';

  /**
   * Holds the loaded data of the database.json file.
   */
  private data: Episode[] = [];

  getEpisodes(): Episode[] {
    return this.data;
  }

  /**
   * Load the local database.json file and populate the data property.
   * @return Promise<void>
   */
  async load(): Promise<void> {
    if (!existsSync(Database.databasePath())) {
      await Database.sync();
    }

    this.data = JSON.parse((await readFile(Database.databasePath())).toString());
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
