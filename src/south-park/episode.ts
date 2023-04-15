import {inject, injectable} from 'inversify';
import {TYouTubeDLSymbol} from '../ioc/types';
import YouTubeDL from '../types/youtubedl';
import {resolve} from 'node:path';

@injectable()
export default class Episode {
  /**
   * The datum that contains the information about this episode.
   */
  public readonly datum: EpisodeDatum;

  /**
   * Reference to the YouTubeDL instance in the container-
   */
  private readonly youtubeDl: YouTubeDL;

  constructor(
    datum: EpisodeDatum,
    @inject(TYouTubeDLSymbol) youtubeDl: YouTubeDL
  ) {
    this.datum = datum;
    this.youtubeDl = youtubeDl;
  }

  /**
   * This method does download the episode parts using YouTube-DL.
   */
  public async download(): Promise<void> {
    await this.youtubeDl.exec(this.url(), {
      output: resolve('todo'),
    });
  }

  /**
   * This method does merge/mux the episode parts using FFMPEG.
   */
  public async merge(): Promise<void> {
    // TODO
  }

  private url(): string {
    return this.datum.languages['de'].url;
  }
}
