import {interfaces} from 'inversify';
import Episode from './episode.js';
import YouTubeDL from '../external/types/youtube-dl.js';
import YouTubeDLSymbol from '../external/symbols/YouTubeDLSymbol.js';

const episodeFactory: interfaces.FactoryCreator<Episode, [EpisodeDatum]> = (
  context: interfaces.Context
) => {
  return (datum: EpisodeDatum): Episode =>
    new Episode(datum, context.container.get<YouTubeDL>(YouTubeDLSymbol));
};
export default episodeFactory;
