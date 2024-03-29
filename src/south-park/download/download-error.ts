import Episode from '../episode.js';

export default class DownloadError extends Error {
  constructor(public episode: Episode, message?: string) {
    super(message);
  }
}
