import {interfaces} from 'inversify';
import Episode from './episode';
import YouTubeDL from '../types/youtubedl';
import {TYouTubeDLSymbol} from '../ioc/types';

export default function episodeFactory(context: interfaces.Context) {
  return (datum: EpisodeDatum) =>
    new Episode(datum, context.container.get<YouTubeDL>(TYouTubeDLSymbol));
}
