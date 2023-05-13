import {interfaces} from 'inversify';
import {Container} from '../core/ioc/container.js';
import Provider from '../core/ioc/provider.js';
import {TFFMPEGSymbol, TYouTubeDLSymbol} from '../core/ioc/types.js';
import FFMPEG, {FfmpegCommand} from 'fluent-ffmpeg';
import {create} from 'youtube-dl-exec';
import YouTubeDL from './types/youtube-dl.js';
import {resolve} from 'path';
import Env from '../core/env.js';

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
      create(resolve(Env.get('YOUTUBE_DL_BIN', '/usr/local/bin'), 'youtube-dl'))
    );
  }

  async boot(container: Container): Promise<void> {
    /* Configure FFMPEG */
    container
      .get<FfmpegCommand>(TFFMPEGSymbol)
      .setFfmpegPath(
        resolve(Env.get('FFMPEG_BIN', '/usr/local/bin'), 'ffmpeg')
      );
    container
      .get<FfmpegCommand>(TFFMPEGSymbol)
      .setFfprobePath(
        resolve(Env.get('FFMPEG_BIN', '/usr/local/bin'), 'ffprobe')
      );
  }
}
