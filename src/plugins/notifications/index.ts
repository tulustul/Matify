export * from './notifications.component';
export * from './notifications.service';
export * from './notifications.module';

import { NotificationsModule } from './notifications.module';
import { MODULES } from 'core/plugging';

MODULES.push(NotificationsModule);
