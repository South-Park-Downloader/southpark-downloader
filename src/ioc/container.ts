import { Container as InversifyJS } from 'inversify';
import FFMPEG, { FfmpegCommand } from 'fluent-ffmpeg';
import App from '../app.js';
import Commander from '../commander.js';
import Database from '../south-park/database.js';
import { TAppSymbol, TCommanderSymbol, TDatabaseSymbol, TFFMPEGSymbol, TYouTubeDLSymbol } from './types.js';
import { create } from 'youtube-dl-exec';
import YouTubeDL from '../types/youtubedl.js';

export class Container extends InversifyJS {
  async register(): Promise<void> {
    /* Bind CommanderJS instance */
    this.bind<Commander>(TCommanderSymbol).toConstantValue(new Commander());

    /* Bind App as singleton */
    this.bind<App>(TAppSymbol).to(App).inSingletonScope();

    /* Bind Database as singleton */
    this.bind<Database>(TDatabaseSymbol).to(Database).inSingletonScope();

    /* Bind FFMPEG instance */
    this.bind<FfmpegCommand>(TFFMPEGSymbol).toConstantValue(FFMPEG());

    /* Bind YouTubeDL instance */
    this.bind<YouTubeDL>(TYouTubeDLSymbol).toConstantValue(create('/usr/local/bin/youtube-dl'));
  }

  async boot(): Promise<void> {
    /* Load the local database file */
    await this.get<Database>(TDatabaseSymbol).load();

    /* Load existing commands */
    await this.get<App>(TAppSymbol).loadCommands();

    /* Configure FFMPEG */
    this.get<FfmpegCommand>(TFFMPEGSymbol).setFfmpegPath('/usr/local/bin/ffmpeg');
    this.get<FfmpegCommand>(TFFMPEGSymbol).setFfprobePath('/usr/local/bin/ffprobe');
  }
}

const container = new Container();
export default container;