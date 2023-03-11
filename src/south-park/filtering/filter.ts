import { exit } from 'process';
import Stop from './stop'

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
    const [ left, right ] = input.split('-');

    /* Initialize a new Stop for the left side */
    this.left = new Stop(left);

    /* Make sure that the left side Stop always defines the season */
    if (typeof this.left.season === 'undefined') {
      throw new Error(`The left side stop of a filter has to define a Season! The input '${left}' is not valid.`);
    }

    /* Check if a right side Stop is provided with the filter input */
    if (right) {
      /* Instance a new Stop for the right side */
      this.right = new Stop(right);

      /* Inherit left side Stop's season in case none is defined for the right side */
      if (! this.right.season) {
        this.right.season = this.left.season;
      }
    }
  }

  /**
   * Match the provided episode against the filter.
   */
  public match(episode: Episode): boolean {
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
   * Helper method to determine if the given episode 
   * is within bounds defined by the left side Stop
   */
  private checkLeftBounds(episode: Episode): boolean {
    /* This is already handled in the constructor. */
    if (typeof this.left.season === 'undefined') {
      exit(1);
    }

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
  private checkRightBounds(episode: Episode): boolean {
    /* Always match episodes if no right bounds is given */
    if (! this.right) {
      return true;
    }

    /* This is already handled in the constructor. */
    if (typeof this.right.season === 'undefined') {
      exit(1);
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
}
