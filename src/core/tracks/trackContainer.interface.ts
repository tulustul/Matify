import { Track } from './track.model';

export interface TrackContainer {
  name: string;
  artworkUri: string;
  tracks: Track[];
  expanded: boolean;
}
