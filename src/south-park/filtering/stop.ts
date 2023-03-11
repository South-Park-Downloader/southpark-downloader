export const StopRegex = /^(S(\d*))?(E(\d*))?$/;

export default class Stop {
  /**
   * The Season this Stop is starting/ending at.
   * In case this is an end Stop, setting this as undefined will inherit the start Stop's season.
   */
  public readonly season?: number;

  /**
   * The Episode this Stop is starting/ending at.
   * This will match ALL episodes of this Stop's season if it is undefined.
   */
  public readonly episode?: number;

  constructor(input: string) {
    /* Check the input and try to extract the season and / or the episode */
    const matches = StopRegex.exec(input);

    /* Handle illegal inputs */
    if (! matches) {
      throw new Error(`The input '${input}' is not a valid filter stop. Please refer to the documentation at TODO.`);
    }

    /* Destruct the result to get the required information while skipping obsolete positions */
    const [
      /* input */,
      /* input season */,
      season,
      /* input episode */,
      episode
    ] = matches;

    /* Set extracted information */
    if (typeof season !== undefined) {
      this.season = parseInt(season);
    }
    if (typeof episode !== undefined) {
      this.episode = parseInt(episode);
    }
  }
}
