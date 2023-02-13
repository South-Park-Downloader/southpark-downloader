import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import fetch from 'node-fetch';
import {injectable} from 'inversify';

@injectable()
export default class Database {
  /**
   * The URL to the database.json file, wille be used to load the current database definition from the repository
   */
  public static url =
    'https://raw.githubusercontent.com/bumbummen99/southpark-downloader/database/database.json';

  /**
   * Defines the absolute path to the local copy of the database.json file.
   */
  public static path = '/database.json';

  /**
   * Holds the loaded data of the database.json file.
   */
  private data: Episode[] = [];

  /**
   * Load the local database.json file and populate the data property.
   * @return Promise<void>
   */
  async load(): Promise<void> {
    if (!existsSync(Database.path)) {
      await Database.sync();
    }

    this.data = JSON.parse((await readFile(Database.path)).toString());
  }

  /**
   * Sync the database.json from the repository.
   * @return Promise<void>
   */
  static async sync(): Promise<void> {
    await fetch(Database.url)
      .then(response => response.json())
      .then(data => {
          writeFile(Database.path, JSON.stringify(data));
      });
  }
}
