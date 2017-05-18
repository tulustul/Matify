import { TracksStore, Track, TrackWord } from 'core/tracks';

export class LocalTracksStore implements TracksStore {

  PAGE_SIZE = 30;

  name = 'local tracks';

  init() {}

  async search(term: string, page: number) {
    let tokens = term.split(' ');
    tokens = tokens.map(t => t.trim()).filter(t => !!t);

    if (!tokens) {
      return null;
    }
    let trackIds = await this.getTrackIds(tokens[0], page);

    for (let token of tokens.slice(1)) {
      trackIds = new Set<number>(
        Array.from(
          await this.getTrackIds(token, page)
        ).filter(id => trackIds.has(id))
      );
    }

    return Track.store.where('id').anyOf(Array.from(trackIds)).toArray();
  }

  async getTrackIds(token: string, page: number) {
    let trackIdsForToken = new Set<number>();
    await TrackWord.store
      .where('word')
      .startsWithAnyOfIgnoreCase(token)
      .offset(page * this.PAGE_SIZE)
      .limit(this.PAGE_SIZE)
      .each(w => trackIdsForToken.add(w.trackId));
    return trackIdsForToken;
  }
}
