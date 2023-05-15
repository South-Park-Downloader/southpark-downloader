import {inject, injectable} from 'inversify';
import {resolve} from 'node:path';
import YouTubeDLSymbol from '../external/symbols/YouTubeDLSymbol.js';
import YouTubeDL from '../external/types/youtube-dl.js';
import {dataDir} from '../core/util.js';
import Env from '../core/env.js';
import {stderr, stdout} from 'node:process';

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
    @inject(YouTubeDLSymbol) youtubeDl: YouTubeDL
  ) {
    this.datum = datum;
    this.youtubeDl = youtubeDl;
  }

  /**
   * This method does download the episode parts using YouTube-DL.
   */
  public async download(): Promise<void> {
    /* Build the path where YouTube-DL can store it's raw output */
    const targetDirectory = resolve(this.directory(), 'download');

    /* Process the URL using YouTube-DL and download the episodes parts / acts */
    const process = this.youtubeDl.exec(this.url(), {
      output: targetDirectory,
    });

    /* Pipe the YouTube DL process outputs to the parent */
    process.stdout?.pipe(stdout);
    process.stderr?.pipe(stderr);

    /* Wait for download to finish */
    await process;
  }

  /**
   * This method does merge/mux the episode parts using FFMPEG.
   */
  public async merge(): Promise<void> {
    // TODO
  }

  /**
   * Get the episode url using the configured language.
   */
  private url(): string {
    return this.datum.languages[Env.get('SOUTHPARK_DL_DEFAULT_LANGUAGE', 'de')]
      .url;
  }

  /**
   * Builds the directory for this episode.
   */
  private directory(): string {
    /* Make sure season and episode index are properly prepended by the correct amount of zeros */
    const formattedSeason = this.datum.season.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    const formattedEpisode = this.datum.season.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });

    /* Build the final episode directory */
    return resolve(dataDir(), `${formattedSeason}/${formattedEpisode}`);
  }

  /**
   * Builds the (file) name for this episode.
   */
  private name(): string {
    /* Make sure season and episode index are properly prepended by the correct amount of zeros */
    const formattedSeason = this.datum.season.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });
    const formattedEpisode = this.datum.season.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    });

    /* Make sure the episode name does not conflict with any media server / library conventions */
    const formattedName =
      this.datum.languages[Env.get('SOUTHPARK_DL_DEFAULT_LANGUAGE', 'de')].name;

    /* Build the final episode basename */
    return `South Park S${formattedSeason}E${formattedEpisode} ${formattedName}`;
  }
}
