export * from './commands';

import { PaletteModule } from './palette.module';
import { MODULES } from 'app/plugging';

MODULES.push(PaletteModule);
