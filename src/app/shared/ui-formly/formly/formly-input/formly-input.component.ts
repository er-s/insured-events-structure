import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import {
  Subject,
  BehaviorSubject,
  combineLatest,
  map,
  takeUntil,
  distinctUntilChanged,
  Observable,
  debounceTime,
} from 'rxjs';

import { CustomTemplateOptions } from './formly-input.type';
import { ValidationService } from '../../../../core/services/validation/validation.service';
import { MaskPatternItem } from '../../../../core/services/validation/interfaces/mask-config.interface';

@Component({
  selector: 'formly-floating-label-input',
  templateUrl: './formly-input.component.html',
  styleUrls: ['./formly-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyInputComponent
  extends FieldType<FormlyFieldConfig<CustomTemplateOptions>>
  implements OnInit, OnDestroy
{
  private readonly destroy$ = new Subject<void>();
  private readonly touched$ = new BehaviorSubject<boolean>(false);
  private readonly inputFocused$ = new BehaviorSubject<boolean>(false);
  private readonly initialized$ = new BehaviorSubject<boolean>(false);

  readonly fieldConfig$ = new BehaviorSubject<{
    type: string;
    isDisabled: boolean;
    maxLength: number | null;
    label: string;
    placeholder: string;
    prefix: any;
    prefillValue?: string;
    mask: string;
    dropSpecialCharacters: any;
    showMaskTyped: any;
    clearIfNotMatch: any;
    patterns?: { [character: string]: MaskPatternItem };
    restrictions: string;
    validationType: string | (() => string);
    helperText: string;
  }>({
    type: 'text',
    isDisabled: false,
    maxLength: null,
    label: '',
    placeholder: '',
    prefix: '',
    prefillValue: '',
    mask: '',
    dropSpecialCharacters: true,
    showMaskTyped: false,
    clearIfNotMatch: true,
    patterns: undefined,
    restrictions: 'none',
    validationType: '',
    helperText: '',
  });

  readonly value$ = new BehaviorSubject<any>(null);

  readonly hasContent$: Observable<boolean> = this.value$.pipe(
    map((value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return true;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;

      return Boolean(value);
    }),
    distinctUntilChanged()
  );

  readonly invalid$: Observable<boolean> = new Observable<boolean>(
    (subscriber) => {
      if (!this.formControl) {
        subscriber.next(false);

        return;
      }

      return this.formControl.statusChanges
        .pipe(
          map((status) => status === 'INVALID'),
          distinctUntilChanged()
        )
        .subscribe(subscriber);
    }
  );

  // readonly showError$ = combineLatest([
  //   this.invalid$,
  //   this.touched$,
  //   this.initialized$,
  //   this.hasContent$,
  // ]).pipe(
  //   map(
  //     ([invalid, touched, initialized, hasContent]) =>
  //       invalid && (touched || (initialized && hasContent))
  //   ),
  //   distinctUntilChanged()
  // );

  readonly showSuccess$ = combineLatest([
    this.invalid$,
    this.touched$,
    this.hasContent$,
    this.initialized$,
    this.fieldConfig$,
  ]).pipe(
    map(([invalid, touched, hasContent, initialized, fieldConfig]) => {
      const isDisabled = fieldConfig.isDisabled;

      if (isDisabled) {
        return hasContent;
      }

      return !invalid && (touched || initialized) && hasContent;
    }),
    distinctUntilChanged()
  );

  readonly shouldFloatLabel$ = combineLatest([
    this.hasContent$,
    this.inputFocused$,
    this.initialized$,
  ]).pipe(
    map(
      ([hasContent, isFocused, initialized]) =>
        hasContent || isFocused || (initialized && hasContent)
    ),
    distinctUntilChanged()
  );

  readonly error$ = new Observable<string>((subscriber) => {
    if (!this.formControl) {
      subscriber.next('');

      return;
    }

    return combineLatest([
      this.formControl.statusChanges,
      this.touched$,
      this.initialized$,
      this.hasContent$,
    ])
      .pipe(
        debounceTime(100),
        map(([_, touched, initialized, hasContent]) => {
          if (!this.formControl?.errors) return '';
          if (!touched && !initialized) return '';
          if (initialized && !hasContent) return '';

          if (this.formControl.hasError('pattern')) {
            if (this.props.validationType) {
              return this.validationService.getErrorMessage(
                this.getValidationType()
              );
            }

            return (
              this.props.patternError || 'Значение не соответствует формату'
            );
          }

          if (this.formControl.hasError('required')) {
            return this.validationService.getErrorMessage('required');
          }

          return this.props.errorMessage || 'Некорректное значение';
        }),
        distinctUntilChanged()
      )
      .subscribe(subscriber);
  });

  readonly helperText$ = this.fieldConfig$.pipe(
    map((config) => config.helperText),
    distinctUntilChanged()
  );

  constructor(
    private validationService: ValidationService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeConfig();
    this.initializeValidation();
    this.listenToValueChanges();

    setTimeout(() => {
      this.validateInitialValue();

      if (this.formControl) {
        const currentValue = this.value$.getValue();
        const hasValue =
          currentValue !== null &&
          currentValue !== undefined &&
          (typeof currentValue !== 'string' || currentValue.trim() !== '');

        if (hasValue) {
          this.formControl.markAsTouched();
          this.formControl.updateValueAndValidity();
          this.cdr.markForCheck();
        }
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getValidationType(): string {
    if (typeof this.props.validationType === 'function') {
      return this.props.validationType() || '';
    }

    return this.props.validationType || '';
  }

  private validateInitialValue(): void {
    const currentValue = this.value$.getValue();

    const hasInitialValue =
      currentValue !== null &&
      currentValue !== undefined &&
      (typeof currentValue !== 'string' || currentValue.trim() !== '');

    if (hasInitialValue) {
      this.initialized$.next(true);

      if (this.field && this.field.formControl) {
        this.field.formControl.markAsTouched();
        this.field.formControl.updateValueAndValidity();
      }
    }
  }

  private initializeConfig(): void {
    const validationType = this.getValidationType();
    let mask = this.props.mask || '';
    let dropSpecialCharacters = true;
    let showMaskTyped = false;
    let clearIfNotMatch = true;
    let patterns: { [character: string]: MaskPatternItem } | undefined =
      undefined;

    if (validationType) {
      const maskConfig = this.validationService.getMaskConfig(validationType);

      if (maskConfig) {
        mask = maskConfig.mask || mask;
        dropSpecialCharacters =
          maskConfig.dropSpecialCharacters ?? dropSpecialCharacters;
        showMaskTyped = maskConfig.showMaskTyped ?? showMaskTyped;
        clearIfNotMatch = maskConfig.clearIfNotMatch ?? clearIfNotMatch;
        patterns = maskConfig.patterns;
      }
    }

    const maskOptions = this.props.maskOptions || {
      mask: '',
      clearIfNotMatch: '',
      dropSpecialCharacters: '',
      showMaskTyped: '',
      patterns: undefined,
    };

    this.fieldConfig$.next({
      type: this.props.type || 'text',
      isDisabled: !!this.props.isDisabled,
      maxLength: this.props.maxlength || null,
      label: this.props.label || '',
      placeholder: this.props.placeholder || '',
      prefix: this.props.prefix || '',
      prefillValue: this.props.prefillValue || '',
      mask: maskOptions.mask || mask,
      dropSpecialCharacters:
        maskOptions.dropSpecialCharacters ?? dropSpecialCharacters,
      showMaskTyped: maskOptions.showMaskTyped ?? showMaskTyped,
      clearIfNotMatch: maskOptions.clearIfNotMatch ?? clearIfNotMatch,
      patterns: maskOptions.patterns ?? patterns,
      restrictions: this.props.restrictions || 'none',
      validationType: validationType,
      helperText:
        this.props.helperText ||
        (validationType
          ? this.validationService.getHelperText(validationType)
          : ''),
    });
  }

  private initializeValidation(): void {
    if (!this.formControl) return;

    if (this.props.validationType && !this.props.pattern) {
      const validator = this.createTypeValidator(this.getValidationType());

      if (validator) {
        this.formControl.addValidators(validator);
        this.formControl.updateValueAndValidity();
      }
    } else if (this.props.pattern) {
      const validator = this.createPatternValidator();

      this.formControl.addValidators(validator);
      this.formControl.updateValueAndValidity();
    }
  }

  private listenToValueChanges(): void {
    if (!this.formControl) return;

    this.value$.next(this.formControl.value);

    this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        this.value$.next(value);
      });
  }

  private createTypeValidator(validationType: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      return this.validationService.validatePattern(
        control.value,
        validationType
      )
        ? null
        : { pattern: true };
    };
  }

  private createPatternValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const patternValue = this.props.pattern;
      let testPattern: RegExp | null = null;

      if (patternValue instanceof RegExp) {
        testPattern = patternValue;
      } else if (
        typeof patternValue === 'string' &&
        this.props.customPatterns
      ) {
        testPattern = this.props.customPatterns[patternValue];
      }

      if (!testPattern) return null;

      return testPattern.test(control.value) ? null : { pattern: true };
    };
  }

  onValueChange(value: any): void {
    this.formControl?.setValue(value);
  }

  onTouched(): void {
    this.touched$.next(true);
    this.formControl?.markAsTouched();
    this.inputFocused$.next(false);
  }

  onFocus(): void {
    this.inputFocused$.next(true);

    const currentValue = this.formControl?.value;
    const prefillValue = this.fieldConfig$.getValue().prefillValue;

    if (prefillValue && (!currentValue || currentValue.trim() === '')) {
      this.formControl?.setValue(prefillValue);
      this.value$.next(prefillValue);
      this.cdr.markForCheck();
    }
  }

  onKeyPress(event: KeyboardEvent): boolean {
    const restrictionType = this.props.restrictions;

    if (!restrictionType || restrictionType === 'none') {
      return true;
    }

    const char = event.key;

    if (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      char === 'Backspace' ||
      char === 'Delete' ||
      char === 'ArrowLeft' ||
      char === 'ArrowRight' ||
      char === 'Tab'
    ) {
      return true;
    }

    const isAllowed = this.validationService.isCharacterAllowed(
      char,
      restrictionType
    );

    if (!isAllowed) {
      event.preventDefault();

      return false;
    }

    return true;
  }

  // Функция для отображения подсказки с ошибкой валидации
  getErrorTooltip(): string {
    const validationType = this.getValidationType();

    if (validationType && this.formControl?.hasError('pattern')) {
      return this.validationService.getErrorMessage(validationType);
    }

    if (this.formControl?.hasError('required')) {
      return this.validationService.getErrorMessage('required');
    }

    return this.props.errorMessage || 'Некорректное значение';
  }

  getErrorMessage(): string {
    const validationType = this.getValidationType();

    if (validationType && this.formControl?.hasError('pattern')) {
      return this.validationService.getErrorMessage(validationType);
    }

    if (this.formControl?.hasError('required')) {
      return this.validationService.getErrorMessage('required');
    }

    return this.props.errorMessage || 'Некорректное значение';
  }
}
