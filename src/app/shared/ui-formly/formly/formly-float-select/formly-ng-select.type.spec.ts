import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyForm } from '@ngx-formly/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { of, Subject } from 'rxjs';
import { FormlyNgSelectTypeModule } from './formly-ng-select.module';

@Component({
  selector: 'test-host-component',
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model" [options]="options"></formly-form>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
}

describe('FormlyNgSelectTypeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgSelectModule,
        FormlyModule.forRoot(),
        FormlyNgSelectTypeModule,
      ],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  function getNgSelect(): NgSelectComponent {
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.directive(NgSelectComponent));
    return de.componentInstance as NgSelectComponent;
  }

  it('should initialize with static options', () => {
    host.fields = [
      {
        key: 'city',
        type: 'ng-select',
        templateOptions: {
          label: 'City',
          options: [
            { label: 'Kyiv', value: 'kyiv' },
            { label: 'Lviv', value: 'lviv' },
          ],
        },
      },
    ];
    const comp = getNgSelect();
    expect(comp).toBeTruthy();
    expect((comp as any).items.length).toBe(2);
  });

  it('should apply required validation and show error via wrapper', () => {
    host.fields = [
      {
        key: 'city',
        type: 'ng-select',
        wrappers: ['form-field-bs5'],
        templateOptions: {
          label: 'City',
          required: true,
          options: [
            { label: 'Kyiv', value: 'kyiv' },
          ],
        },
      },
    ];
    fixture.detectChanges();
    // mark touched to trigger error display
    host.form.markAllAsTouched();
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(errorEl).toBeTruthy();
  });

  it('should set disabled and multiple flags on ng-select', () => {
    host.fields = [
      {
        key: 'users',
        type: 'ng-select',
        templateOptions: {
          multiple: true,
          disabled: true,
          options: [],
        },
      },
    ];
    const comp = getNgSelect();
    expect(comp.multiple).toBeTrue();
    expect(comp.disabled).toBeTrue();
  });

  it('should debounce typeahead search and call typeaheadFn', fakeAsync(() => {
    const calls: string[] = [];
    const typeaheadFn = (term: string) => {
      calls.push(term);
      return of([{ label: term, value: term }]);
    };
    host.fields = [
      {
        key: 'q',
        type: 'ng-select',
        templateOptions: {
          async: true,
          typeaheadDebounce: 200,
          typeaheadFn,
        },
      },
    ];
    fixture.detectChanges();

    const comp = getNgSelect();
    // emit search events quickly
    (comp as any).searchTerm = 'a';
    comp.searchEvent.emit({ term: 'a', items: [] } as any);
    tick(100);
    comp.searchEvent.emit({ term: 'ab', items: [] } as any);
    tick(200);
    fixture.detectChanges();
    expect(calls).toEqual(['ab']);
  }));

  it('should trigger onChange callback', () => {
    const onChange = jasmine.createSpy('onChange');
    host.fields = [
      {
        key: 'v',
        type: 'ng-select',
        templateOptions: {
          options: [ { label: 'One', value: 1 } ],
          onChange,
        },
      },
    ];
    const comp = getNgSelect();
    comp.changeEvent.emit(1);
    fixture.detectChanges();
    expect(onChange).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('should support grouping via groupBy string', () => {
    host.fields = [
      {
        key: 'item',
        type: 'ng-select',
        templateOptions: {
          groupBy: 'cat',
          options: [
            { label: 'A1', value: 'a1', cat: 'A' },
            { label: 'B1', value: 'b1', cat: 'B' },
          ],
        },
      },
    ];
    const comp = getNgSelect();
    expect(comp.groupBy).toBe('cat' as any);
  });

  it('should enable addTag', () => {
    host.fields = [
      {
        key: 'tags',
        type: 'ng-select',
        templateOptions: {
          addTag: true,
          options: [],
        },
      },
    ];
    const comp = getNgSelect();
    expect(comp.addTag).toBeTrue();
  });
});


