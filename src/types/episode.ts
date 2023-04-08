declare type EpisodeData = EpisodeDatum[];

declare type EpisodeDatum = {
  season: number;
  index: number;
  languages: {
    [language: string]: {
      url: string;
      name: string;
    };
  };
};
