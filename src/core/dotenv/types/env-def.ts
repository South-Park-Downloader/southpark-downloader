/**
 * This type defines the environment the application is expection.
 */
type EnvDef = {
  /* Global configuration */
  DEBUG?: boolean;

  /* SouthParkDL configuration */
  SOUTHPARK_DL_NAME: string;
  SOUTHPARK_DL_DEFAULT_LANGUAGE: 'de' | 'en';
  SOUTHPARK_DL_DATA_DIR: string;

  /* YouTubeDL configuration */
  YOUTUBE_DL_BIN: string;

  /* FFMPEG configuration */
  FFMPEG_DIR: string;
};
