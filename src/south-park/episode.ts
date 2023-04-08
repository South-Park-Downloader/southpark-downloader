export default class Episode {
  /**
   * The datum that contains the information about this episode.
   */
  public readonly datum: EpisodeDatum;

  constructor(datum: EpisodeDatum) {
    this.datum = datum;
  }

  /**
   * Initialize Episode instances from the provided EpisodeData.
   */
  static fromData(data: EpisodeData): Episode[]
  {
    return data.map((datum: EpisodeDatum) => new this(datum));
  }

  /**
   * This method does download the episode parts using YouTube-DL.
   */
  public async download(): Promise<void>
  {
    // TODO
  }

  /**
   * This method does merge/mux the episode parts using FFMPEG.
   */
  public async merge(): Promise<void>
  {
    // TODO
  }
}