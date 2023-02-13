export default class EpisodeFilter {
  public season: number
  public episode?: number
  public toSeason?: number
  public toEpisode?: number

  constructor(season: number, episode?: number, toSeason?: number, toEpisode?: number) {
    this.season = season
    this.episode = episode
    this.toSeason = toSeason
    this.toEpisode = toEpisode
  }

  /**
   * Determines if this filter is specific or a range
   */
  public isRange(): boolean {
    return typeof this.toSeason === 'number'
  }

  /**
   * Match the provided episode against the filter.
   */
  public match(episode: Episode): boolean {
    if (this.isRange()) {
      /* Verify episode within left side bounds */
      if (episode.season < this.season) {
        return false
      }

      /* Cut off left side season if episode bounds is defined */
      if (typeof this.episode === 'number' && episode.season === this.season && episode.index < this.episode) {
        return false
      }

      /* Cut off right side season if episode bounds is defined */
      if (typeof this.toEpisode === 'number' && episode.season === this.toSeason && episode.index > this.toEpisode) {
        return false
      }
    } else {
      /* Always filter for season */
      if (episode.season !== this.season) {
        return false
      }

      /* Filter for episode if provided */
      if (typeof this.episode === 'number' && episode.index !== this.episode) {
        return false
      }
    }

    return true
  }
}
