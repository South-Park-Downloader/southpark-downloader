import {interfaces} from 'inversify';
import Episode from './episode.js';
import YouTubeDL from '../external/types/youtube-dl.js';
import {TYouTubeDLSymbol} from '../core/ioc/types.js';

const episodeFactory: interfaces.FactoryCreator<Episode, [EpisodeDatum]> = (
  context: interfaces.Context
) => {
  return (datum: EpisodeDatum): Episode =>
    new Episode(datum, context.container.get<YouTubeDL>(TYouTubeDLSymbol));
};
export default episodeFactory;
