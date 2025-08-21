import { Component } from '@angular/core';
import { FieldWrapper, FormlyFieldConfig } from '@ngx-formly/core';

/**
 * Bootstrap 5 form-field wrapper for Formly fields.
 */
@Component({
  selector: 'formly-bs5-form-field-wrapper',
  template: `
    <div class="mb-3" [class.was-validated]="showError">
      <label *ngIf="to.label" [attr.for]="id" class="form-label">{{ to.label }}</label>
      <ng-container #fieldComponent></ng-container>
      <div *ngIf="to.description" class="form-text">{{ to.description }}</div>
      <div *ngIf="showError" class="invalid-feedback d-block">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>
  `,
})
export class FormlyBootstrap5FormFieldWrapper extends FieldWrapper<FormlyFieldConfig> {}


