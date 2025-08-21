import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    BrowserAnimationsModule,
    NoopAnimationsModule
} from '@angular/platform-browser/animations';

import { InsuredEventsModule } from './features/insured-events/insured-events.module';
import { InsuredEventsComponent } from './insured-events.component';
import { InsuredEventsRoutingModule } from './insured-events-routing.module';

@NgModule({
    declarations: [InsuredEventsComponent],
    imports: [
        BrowserModule,
        InsuredEventsRoutingModule,
        InsuredEventsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
    ],
    bootstrap: [InsuredEventsComponent]
})
export class InsuredEventsMFEModule {}
