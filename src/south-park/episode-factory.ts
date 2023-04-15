import {interfaces} from 'inversify';
import Episode from './episode';
import YouTubeDL from '../types/youtubedl';
import {TYouTubeDLSymbol} from '../ioc/types';

const episodeFactory: interfaces.FactoryCreator<Episode, [EpisodeDatum]> = (
  context: interfaces.Context
) => {
  return (datum: EpisodeDatum): Episode =>
    new Episode(datum, context.container.get<YouTubeDL>(TYouTubeDLSymbol));
};
export default episodeFactory;
