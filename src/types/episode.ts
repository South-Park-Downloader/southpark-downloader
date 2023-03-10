declare type Episode = {
  season: number;
  index: number;
  languages: {
    [language: string]: {
      url: string;
      name: string;
    };
  };
};
