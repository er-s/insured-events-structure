import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyNgSelectTypeComponent } from './formly-ng-select.type';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyBootstrap5FormFieldWrapper } from './formly-bs5-form-field.wrapper';

@NgModule({
  declarations: [FormlyNgSelectTypeComponent, FormlyBootstrap5FormFieldWrapper],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'ng-select',
          component: FormlyNgSelectTypeComponent,
          wrappers: ['form-field-bs5'],
                     defaultOptions: {
             templateOptions: {
               bindLabel: 'label',
               bindValue: 'value',
               clearable: true,
               searchable: true,
               closeOnSelect: true,
               dropdownPosition: 'auto',
               typeaheadDebounce: 250,
               minTermLength: 1,
             },
           },
        },
        {
          name: 'formly-float-select',
          component: FormlyNgSelectTypeComponent,
          wrappers: ['form-field-bs5'],
        },
      ],
      wrappers: [
        { name: 'form-field-bs5', component: FormlyBootstrap5FormFieldWrapper },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
        { name: 'minLength', message: (err, field) => `Minimum length is ${field?.templateOptions?.minLength}.` },
        { name: 'maxLength', message: (err, field) => `Maximum length is ${field?.templateOptions?.maxLength}.` },
        { name: 'min', message: (err, field) => `Minimum value is ${field?.templateOptions?.min}.` },
        { name: 'max', message: (err, field) => `Maximum value is ${field?.templateOptions?.max}.` },
        { name: 'pattern', message: 'The value does not match the expected pattern.' },
      ],
    }),
  ],
  exports: [FormlyNgSelectTypeComponent, FormlyBootstrap5FormFieldWrapper],
})
export class FormlyNgSelectTypeModule {}


