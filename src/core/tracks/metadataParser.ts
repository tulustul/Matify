import { Track } from './track.interface';

export function extendMetadata(track: Track) {
  if (!track.artist) {
    const tokens = track.title.split('-');
    if (tokens.length === 2) {
      track.artist = tokens[0];
      track.title = tokens[1];
    }
  }
  return track;
}
