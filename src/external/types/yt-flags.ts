import {exec} from 'youtube-dl-exec';

declare type YTFlags = Exclude<Parameters<typeof exec>[1], undefined>;

export default YTFlags;
