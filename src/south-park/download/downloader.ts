import PromisePool, {
  Stoppable,
  UsesConcurrency,
} from '@supercharge/promise-pool/dist';
import Episode from '../episode';
import DownloadError from './download-error';
import DownloadResult from './download-result';

export default class Downloader {
  constructor(public parallel: number = 4) {}

  /**
   * Process and download the provided Episodes
   * using the set configuration.
   */
  async process(episodes: Episode[]): Promise<void> {
    /* Download provided episodes using parallel pool */
    const result = await new PromisePool(episodes)
      .withConcurrency(this.parallel)
      .process<DownloadResult, DownloadError>(
        async (
          episode: Episode,
          index: number,
          pool: Stoppable & UsesConcurrency
        ) => {
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
