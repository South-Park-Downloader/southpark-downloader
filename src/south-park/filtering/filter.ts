import { exit } from 'process';
import Stop from './stop.js'

export default class Filter {
  /**
   * Defines the specific season/episode or left side bounds of this Filter.
   */
  private left: Stop;

  /**
   * If set this defines the right side bounds of this Filter as well as turning this filter into a range filter.
   */
  private right?: Stop;

  constructor(input: string) {
    /* Try to split the input into left and right side 'Stop' */
    let [ left, right ] = input.split('-');
    console.debug(`Initializing new Filter with left "${left}" and right "${right}"`);

    /* Initialize a new Stop for the left side */
    this.left = new Stop(left);

    /* Check if a right side Stop is provided with the filter input */
    if (right) {
      /* Inherit left stop season if right stop has none */
      if (! this.hasSeason(right)) {
        right = `S${this.left.season}${right}`;
      }

      /* Select whole season if right stop does not specify episode */
      if (! this.hasEpisode(right)) {
        right = `${right}E${Number.MAX_SAFE_INTEGER}`;
      }

      this.right =  new Stop(right);
    } else {
      /* Check if left input does NOT specify the episode */
      if (! this.hasEpisode(left)) {
        /* Select all episodes of the season specified in left stop */
        this.right = new Stop(`S${this.left.season}E${Number.MAX_SAFE_INTEGER}`);
      }
    }

    console.log(`Initialized Filter (${this.isRange() ? 'range' : 'specific'}) with left: '${this.left.format()}'${this.right ? ` and right: '${this.right.format()}'` : '.' }`)
  }

  /**
   * Match the provided episode against the filter. In case the 
   * right side Stop is set this will act as a Range filter.
   */
  public match(episode: EpisodeDatum): boolean {
    /* Use the correct logic to determine if the episode matches the filter */
    if (this.isRange()) {
      /* Check left and right side bounds as range */
      return this.checkLeftBounds(episode) && this.checkRightBounds(episode);
    } else {
      /* Match as specific filter for season and episode if provided */
      return (
        /* verify episode is given season */
        (episode.season === this.left.season) &&

        /* verify episode is given index if index is provided */
        (typeof this.left.episode !== 'undefined' ? episode.index === this.left.episode : true)
      );
    }
  }

  /**
   * Helper method to determine if the given episode is 
   * within bounds defined by the left side Stop
   */
  private checkLeftBounds(episode: EpisodeDatum): boolean {
    return (
      /* Verify episode within season bounds */
      (episode.season >= this.left.season) &&

      /* Verify episode within episode bounds if episode season is same as season bounds */
      (episode.season === this.left.season && typeof this.left.episode !== 'undefined' ? episode.index >= this.left.episode : true)
    );
  }

  /**
   * Helper method to determine if the given episode is within bounds 
   * defined by the right side Stop (in case it has been provided)
   */
  private checkRightBounds(episode: EpisodeDatum): boolean {
    /* Always match episodes if no right bounds is given */
    if (! this.right) {
      return true;
    }

    return (
      /* Verify episode within season bounds */
      (episode.season <= this.right.season) &&

      /* verify episode within episode bounds if episode season is same as season bounds */
      (episode.season === this.right.season && typeof this.right.episode !== 'undefined' ? episode.index <= this.right.episode : true)
    )
  }

  /**
   * Determines if this filter is specific or a range
   */
  private isRange(): boolean {
    return !! this.right;
  }

  /**
   * Fluent helper to determine if the provided
   * Filter input defines the Season.
   */
  private hasSeason(input: string): boolean
  {
    return input.includes('S');
  }

  /**
   * Fluent helper to determine if the provided
   * Filter input defines the Episode.
   */
  private hasEpisode(input: string): boolean
  {
    return input.includes('E');
  }
}
