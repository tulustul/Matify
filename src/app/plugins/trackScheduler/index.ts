export * from './trackScheduler.service';

import { TrackSchedulerModule } from './trackScheduler.module';
import { MODULES } from 'app/plugging';

MODULES.push(TrackSchedulerModule);
