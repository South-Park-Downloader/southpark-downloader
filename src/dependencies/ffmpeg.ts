import {FfmpegCommand} from 'fluent-ffmpeg';
const ffmpeg = new FfmpegCommand();
ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');
ffmpeg.setFfprobePath('/usr/local/bin/ffprobe');
export default ffmpeg;
