export interface Track {
  uri: string;
  title: string;
  album: string;
  artist: string;
  track: string;
  year: number;
  genre: string;
  length: number;
  artworkUri: string;
  videoUri?: string;
  source: string;
  sourceId: string;
}

export interface TrackContainer {
  name: string;
  artworkUri: string;
  tracks: Track[];
  expanded: boolean;
}
