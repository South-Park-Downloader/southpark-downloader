import {
  PromisePool,
  Stoppable,
  UsesConcurrency,
} from '@supercharge/promise-pool';
import Episode from '../episode.js';
import DownloadError from './download-error.js';
import DownloadResult from './download-result.js';
import {injectable} from 'inversify';
import Env from '../../core/env.js';

@injectable()
export default class Downloader {
  constructor(private parallel: number = 4) {
    /* Disable parallel execution during debugging */
    if (Env.get('DEBUG') === 'true') {
      this.parallel = 1;
    }
  }

  /**
   * Process and download the provided Episodes
   * using the set configuration.
   */
  async process(episodes: Episode[]): Promise<void> {
    const pool = new PromisePool(episodes).withConcurrency(this.parallel);

    /* Download provided episodes using parallel pool */
    const result = await pool.process<DownloadResult, DownloadError>(
      async (
        episode: Episode,
        index: number,
        pool: Stoppable & UsesConcurrency
      ) => {
        /* Download the episode using YouTube-DL */
        console.log('Downloader before download');
        await episode.download();

        /* Merge the downloaded parts / acts */
        console.log('Downloader before merge');
        await episode.merge();

        return new DownloadResult();
      }
    );
    /* Handle possible errors */
    if (result.errors) {
      // Handle the errors
    }
    /* Profit ? */
  }
}
