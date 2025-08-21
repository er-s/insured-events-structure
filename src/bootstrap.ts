import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { InsuredEventsMFEModule } from './app/insured-events.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(InsuredEventsMFEModule).catch((error: any) => console.error(error));
