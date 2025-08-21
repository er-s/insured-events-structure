import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InsuredEventsComponent } from './insured-events.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InsuredEventsComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                './features/insured-events/insured-events.module'
                            ).then((m) => m.InsuredEventsModule)
                    }
                ]
            },
            { path: '**', redirectTo: '' }
        ] as Routes)
    ],
    exports: [RouterModule]
})
export class InsuredEventsRoutingModule {}
