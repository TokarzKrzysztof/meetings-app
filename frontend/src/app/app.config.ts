import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { matAutocompleteDefaultOptions, matFormFieldDefaultOptions, matSelectConfig } from './utils/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: matFormFieldDefaultOptions },
    { provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, useValue: matAutocompleteDefaultOptions },
    { provide: MAT_SELECT_CONFIG, useValue: matSelectConfig },
  ],
};
