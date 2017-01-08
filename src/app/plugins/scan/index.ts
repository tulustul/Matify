export * from './commands';

import { PaletteModule } from './scan.module';
import { MODULES } from 'app/plugging';

MODULES.push(PaletteModule);
