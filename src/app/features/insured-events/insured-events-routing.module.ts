import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InsuredEventsComponent } from './insured-events.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: InsuredEventsComponent },
    ] as Routes),
  ],
  exports: [RouterModule],
})
export class InsuredEventsRoutingModule {}
