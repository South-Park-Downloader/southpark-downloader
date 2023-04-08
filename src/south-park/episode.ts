export default class Episode {
  /**
   * The datum that contains the information about this episode.
   */
  public readonly datum: EpisodeDatum;

  constructor(datum: EpisodeDatum) {
    this.datum = datum;
  }

  /**
   * This method does download the episode parts using YouTube-DL
   */
  public async download(): Promise<void>
  {
    // TODO
  }

  /**
   * This method does merge/mux the episode parts using FFMPEG
   */
  public async merge(): Promise<void>
  {
    // TODO
  }
}