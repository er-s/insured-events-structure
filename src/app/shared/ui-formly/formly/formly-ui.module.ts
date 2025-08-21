import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyNgSelectTypeModule } from './formly-float-select/formly-ng-select.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, ReactiveFormsModule, FormlyNgSelectTypeModule],
    exports: [ReactiveFormsModule, FormlyModule, FormlyNgSelectTypeModule]
})
export class FormlyUiModule {}
