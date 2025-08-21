import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontUtilsModule } from '@lkam/front-utils';
import { FormlyModule } from '@ngx-formly/core';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { FormlyUiModule } from '../../shared/ui-formly/formly/formly-ui.module';
import { InsuredEventsMainComponent } from './components/main/main.component';
import { InsuredEventsComponent } from './insured-events.component';
import { InsuredEventsRoutingModule } from './insured-events-routing.module';
import { DictionaryRepository } from './ports/dictionaries.repository';
import { InsuredEventsRepository } from './ports/insured-events.repository';
import { InsuredEventsHttpRepository } from './services';
import { InsuredEventsService } from './services';
import { CachedInsuredEventsRepository } from './services';
import {
    CachedDictionaryRepository,
    DictionariesHttpRepository
} from './services';
import { InMemoryCacheService } from './services/cahe/in-memory-cache.service';

@NgModule({
    declarations: [InsuredEventsComponent, InsuredEventsMainComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        FrontUtilsModule,
        TabsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        InsuredEventsRoutingModule,
        FormlyModule.forRoot({}),
        FormlyUiModule
    ],
    providers: [
        InsuredEventsService,
        {
            provide: InsuredEventsHttpRepository,
            useFactory: (http: HttpClient) =>
                new InsuredEventsHttpRepository(http),
            deps: [HttpClient]
        },
        {
            provide: InsuredEventsRepository,
            useFactory: (http: HttpClient, cache: InMemoryCacheService<any>) =>
                new CachedInsuredEventsRepository(
                    new InsuredEventsHttpRepository(http),
                    cache
                ),
            deps: [HttpClient, InMemoryCacheService]
        },
        {
            provide: DictionariesHttpRepository,
            useFactory: (http: HttpClient) =>
                new DictionariesHttpRepository(http),
            deps: [HttpClient]
        },
        {
            provide: DictionaryRepository,
            useFactory: (
                httpRepo: DictionariesHttpRepository,
                cache: InMemoryCacheService<any>
            ) => new CachedDictionaryRepository(httpRepo, cache),
            deps: [DictionariesHttpRepository, InMemoryCacheService]
        }
    ]
})
export class InsuredEventsModule {}
