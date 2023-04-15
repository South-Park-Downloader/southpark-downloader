import InvalidFilterStopError from '../../errors/InvalidFilterStopError.js';

export const StopRegex = /^(S(\d*))?(E(\d*))?$/;

export default class Stop {
  /**
   * The Season this Stop is starting/ending at.
   * In case this is an end Stop, setting this as undefined will inherit the start Stop's season.
   */
  public readonly season: number;

  /**
   * The Episode this Stop is starting/ending at.
   * This will match ALL episodes of this Stop's season if it is undefined.
   */
  public readonly episode: number;

  constructor(input: string) {
    /* Check the input and try to extract the season and / or the episode */
    const matches = StopRegex.exec(input);

    /* Handle illegal inputs */
    if (!matches) {
      throw new InvalidFilterStopError(input);
    }

    /* Destruct the result to get the required information while skipping obsolete positions */
    const [
      ,
      ,
      /* input */ /* input season */ season,
      ,
      /* input episode */ episode,
    ] = matches;
    console.debug(`typeof season ${typeof season}, typeof episode ${episode}`);

    /* Set extracted information */
    this.season = parseInt(season);
    if (episode !== undefined) {
      this.episode = parseInt(episode);
    } else {
      this.episode = 1;
    }
  }

  public format(): string {
    /* Pad season and episode with leading zero to make sure we awlays have two digits */
    const season = this.season.toString().padStart(2, '0');
    const episode = this.episode.toString().padStart(2, '0');

    return `S${season}E${episode}`;
  }
}
