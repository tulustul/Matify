export * from './models';
export * from './playlist.component';
export * from './playlist.module';
export * from './playlist.service';

import { PlaylistModule } from './playlist.module';
import { MODULES } from 'core/plugging';

MODULES.push(PlaylistModule);
