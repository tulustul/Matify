import { TracksStore } from 'core/tracks';

import { LocalTrack, LocalTrackWord } from './localTrack.model';

export class LocalTracksStore implements TracksStore {

  name = 'local tracks';

  init() {}

  async search(term: string) {
    let tokens = term.split(' ');
    tokens = tokens.map(t => t.trim()).filter(t => !!t);

    if (!tokens) {
      return null;
    }

    let trackIds = await this.getTrackIds(tokens[0]);

    for (let token of tokens.slice(1)) {
      trackIds = new Set<number>(
        Array.from(
          await this.getTrackIds(token)
        ).filter(id => trackIds.has(id))
      );
    }

    return LocalTrack.store.where('id').anyOf(Array.from(trackIds)).toArray();
  }

  async getTrackIds(token: string) {
    let trackIdsForToken = new Set<number>();
    await LocalTrackWord.store
      .where('word')
      .startsWithAnyOfIgnoreCase(token)
      .limit(30)
      .each(w => trackIdsForToken.add(w.localTrackId));
    return trackIdsForToken;
  }
}
