export * from './models';
export * from './playlist.component';
export * from './playlist.module';

import { PlaylistModule } from './playlist.module';
import { MODULES } from 'app/plugging';

MODULES.push(PlaylistModule);
