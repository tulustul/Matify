export * from './models';
export * from './playlist.service';
export * from './playlist.component';
export * from './playlist.module';

import { PlaylistModule } from './playlist.module';
import { MODULES } from 'core/plugging';

MODULES.push(PlaylistModule);
