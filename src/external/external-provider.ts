import {interfaces} from 'inversify';
import {Container} from '../core/ioc/container.js';
import Provider from '../core/ioc/provider.js';
import {TFFMPEGSymbol, TYouTubeDLSymbol} from '../core/ioc/types.js';
import FFMPEG, {FfmpegCommand} from 'fluent-ffmpeg';
import {create} from 'youtube-dl-exec';
import YouTubeDL from './types/youtube-dl.js';

export default class ExternalProvider extends Provider {
  async register(
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind,
    unbindAsync: interfaces.UnbindAsync
  ): Promise<void> {
    /* Bind FFMPEG instance */
    bind<FfmpegCommand>(TFFMPEGSymbol).toConstantValue(FFMPEG());

    /* Bind YouTubeDL instance */
    bind<YouTubeDL>(TYouTubeDLSymbol).toConstantValue(
      create('/usr/local/bin/youtube-dl')
    );
  }

  async boot(container: Container): Promise<void> {
    /* Configure FFMPEG */
    container
      .get<FfmpegCommand>(TFFMPEGSymbol)
      .setFfmpegPath('/usr/local/bin/ffmpeg');
    container
      .get<FfmpegCommand>(TFFMPEGSymbol)
      .setFfprobePath('/usr/local/bin/ffprobe');
  }
}
