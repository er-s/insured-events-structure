import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap, finalize, filter, catchError } from 'rxjs/operators';

/**
 * Formly type component based on @ng-select/ng-select.
 * Supports async options, typeahead, caching, infinite scroll, and rich configuration through templateOptions.
 */
@Component({
  selector: 'formly-ng-select-type',
  templateUrl: './formly-ng-select.type.html',
  styleUrls: ['./formly-ng-select.type.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyNgSelectTypeComponent extends FieldType<FormlyFieldConfig> implements OnInit, OnDestroy {
  /** Emits search terms entered by the user. */
  public readonly search$ = new Subject<string>();

  /** Whether the component is currently loading options (async/typeahead). */
  public loading = false;

  /** Destroy notifier. */
  private readonly destroy$ = new Subject<void>();

  /** Current page for infinite scroll. */
  public page = 1;

  /** Accumulated items when async/typeahead/infinite scroll is enabled. */
  public accumulated: any[] = [];

  /** Local non-async items when using static options. */
  private localOptions: any[] = [];

  /** Simple in-memory cache for typeahead results. */
  public readonly cache = new Map<string, { ts: number; items: any[] }>();

  /** Tracks if we are in async/typeahead mode. */
  private usingAsync = false;

  @ViewChild(NgSelectComponent) private ngSelect?: NgSelectComponent;



  /** Last search term used for async requests (for infinite scroll). */
  private lastTerm = '';

  /** Resolve templateOptions with a fallback and strong typing. */
  public getTo<T>(key: string, fallback?: T): T {
    const to: any = this.to || {};
    const value = to[key];
    return (value !== undefined ? value : fallback) as T;
  }

  /** Compute items to display in the dropdown based on mode. */
  public get items(): any[] {
    return this.usingAsync ? this.accumulated : (this.localOptions || []);
  }

  /** Strongly-typed control for template binding. */
  public get control(): FormControl {
    return this.formControl as FormControl;
  }

  /**
   * Lifecycle hook: sets up options stream and typeahead behavior.
   */
  public ngOnInit(): void {
    // Determine if we are using async/typeahead mode
    this.usingAsync = !!(this.getTo<boolean>('async') || this.getTo<any>('typeaheadFn'));

    // Initialize options if provided as array or observable
    const providedOptions = this.getTo<any>('options');
    if (providedOptions && typeof (providedOptions as any).subscribe === 'function') {
      // options as Observable
      (providedOptions as Observable<any[]>)
        .pipe(takeUntil(this.destroy$))
        .subscribe(items => {
          if (this.usingAsync) {
            this.accumulated = Array.isArray(items) ? items.slice() : [];
          } else {
            this.localOptions = Array.isArray(items) ? items.slice() : [];
          }
        });
    } else if (Array.isArray(providedOptions)) {
      if (this.usingAsync) {
        this.accumulated = providedOptions.slice();
      } else {
        this.localOptions = providedOptions.slice();
      }
    }

    // Setup typeahead behavior if enabled
    if (this.usingAsync) {
      const debounceMs = this.getTo<number>('typeaheadDebounce', 250);
      const minTermLength = this.getTo<number>('minTermLength', 1);

      this.search$
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(debounceMs),
          distinctUntilChanged(),
          filter((term) => (term ? term.length : 0) >= (minTermLength || 0)),
          tap(term => {
            this.lastTerm = term || '';
            this.page = 1;
            this.loading = true;
          }),
          switchMap(term => this.resolveOptions(term)
            .pipe(
              catchError(() => of([])),
              finalize(() => { this.loading = false; }),
            )
          ),
        )
        .subscribe(items => {
          this.accumulated = Array.isArray(items) ? items.slice() : [];
        });
    }
  }

  /**
   * Lifecycle hook: completes internal subjects to prevent memory leaks.
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Handle dropdown open. Optionally trigger initial fetch. */
  public handleOpen(): void {
    if (this.getTo<boolean>('fetchOnOpen')) {
      this.handleSearch('');
    }
    const cb = this.getTo<((field?: FormlyFieldConfig) => void)>('onOpen');
    if (cb) { cb(this.field); }
  }

  /** Handle dropdown close. */
  public handleClose(): void {
    const cb = this.getTo<((field?: FormlyFieldConfig) => void)>('onClose');
    if (cb) { cb(this.field); }
  }

  /** Handle input blur. */
  public handleBlur(): void {
    const cb = this.getTo<((field?: FormlyFieldConfig) => void)>('onBlur');
    if (cb) { cb(this.field); }
  }

  /** Handle input focus. */
  public handleFocus(): void {
    const cb = this.getTo<((field?: FormlyFieldConfig) => void)>('onFocus');
    if (cb) { cb(this.field); }
  }

  /** Handle clear selection. */
  public handleClear(): void {
    const cb = this.getTo<((field?: FormlyFieldConfig) => void)>('onClear');
    if (cb) { cb(this.field); }
  }

  /** Handle model change. */
  public handleChange(value: any): void {
    if (this.getTo<boolean>('readOnly')) { return; }
    const cb = this.getTo<((value: any, field?: FormlyFieldConfig) => void)>('onChange');
    if (cb) { cb(value, this.field); }
    if (this.ngSelect && this.getTo('closeOnSelect', true)) {
      this.ngSelect.close();
    }
  }



  /** Handle search term change. */
  public handleSearch(term: string): void {
    const cb = this.getTo<((term: string, field?: FormlyFieldConfig) => void)>('onSearch');
    if (cb) { cb(term, this.field); }
    if (this.usingAsync) {
      this.search$.next(term || '');
    }
  }

  /** Load next page for infinite scroll if enabled. */
  public loadMore(): void {
    if (!this.getTo<boolean>('infiniteScroll')) { return; }
    const loadMoreFn = this.getTo<((term: string, page: number) => Observable<any[]>)>('loadMoreFn');
    if (!loadMoreFn) { return; }

    const term = this.lastTerm || '';
    const nextPage = (this.page || 1) + 1;
    this.loading = true;
    loadMoreFn(term, nextPage)
      .pipe(finalize(() => { this.loading = false; }))
      .subscribe(items => {
        const next = Array.isArray(items) ? items : [];
        this.page = nextPage;
        this.accumulated = [...(this.accumulated || []), ...next];
      });
  }

  /** Resolve options by term with optional caching. */
  private resolveOptions(term: string): Observable<any[]> {
    const cacheEnabled = !!this.getTo<boolean>('cache');
    const ttl = this.getTo<number>('cacheTTL', 60000);
    const now = Date.now();

    if (cacheEnabled) {
      const cached = this.cache.get(term || '');
      if (cached && (now - cached.ts) <= ttl) {
        return of(cached.items);
      }
    }

    const typeaheadFn = this.getTo<((term: string) => Observable<any[]>)>('typeaheadFn');
    let source$: Observable<any[]> = of([]);

    if (typeaheadFn) {
      source$ = typeaheadFn(term || '');
    } else {
      // Fallback: if options is observable, it may represent async options independent of term
      const providedOptions = this.getTo<any>('options');
      if (providedOptions && typeof (providedOptions as any).subscribe === 'function') {
        source$ = (providedOptions as Observable<any[]>);
      } else if (Array.isArray(providedOptions)) {
        // Local filtering when static options are provided and async mode is on
        const bindLabel = this.getTo<string>('bindLabel') || this.getTo<string>('labelProp') || 'label';
        const termLower = (term || '').toLowerCase();
        source$ = of(providedOptions.filter((it: any) => {
          const label = (it && it[bindLabel]) ? String(it[bindLabel]) : String(it);
          return label.toLowerCase().includes(termLower);
        }));
      }
    }

    return source$.pipe(tap(items => {
      if (cacheEnabled) {
        this.cache.set(term || '', { ts: now, items: Array.isArray(items) ? items.slice() : [] });
      }
    }));
  }
}


