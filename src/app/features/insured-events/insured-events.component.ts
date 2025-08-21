import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { InsuredEvent, InsuredEventFilter } from './types/insured-event.types';
import { InsuredEventsFacade } from './services/insured-events.facade';
import {
    InsuredEventsSearchFormBuilder,
    SelectOption
} from './form/form-builders/search-form.builder';
import { filtersConfig } from './form/configs/filters.config';

@Component({
    selector: 'app-insured-events',
    templateUrl: './insured-events.component.html',
    styleUrls: ['insured-events.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class InsuredEventsComponent implements OnInit {
    private readonly destroySignal$$ = new ReplaySubject<void>(1);

    private user: any = null;
    private real: any = null;

    form = new FormGroup({});
    model: InsuredEventFilter = {} as InsuredEventFilter;
    fields: FormlyFieldConfig[] = [];
    data: InsuredEvent[] = [];

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly store: Store,
        private readonly facade: InsuredEventsFacade
    ) {}

    ngOnInit(): void {
        this.facade
            .getFilterDictionaries()
            .pipe(takeUntil(this.destroySignal$$))
            .subscribe((dicts) => {
                const insuranceTypes: SelectOption[] = this.mapStringsToOptions(
                    dicts.insuranceTypes
                );
                const eventStatuses: SelectOption[] = this.mapStringsToOptions(
                    dicts.eventStatuses
                );
                const payoutDecisions: SelectOption[] = [];

                this.fields = filtersConfig(
                    insuranceTypes,
                    eventStatuses,
                    payoutDecisions
                );
            });

        this.loadData();
        this.activatedRoute.queryParams
            .pipe(takeUntil(this.destroySignal$$))
            .subscribe((queryParams: any) => {
                /* Do something here */
            });
        this.store
            .select('profile' as any)
            .pipe(takeUntil(this.destroySignal$$))
            .subscribe((profile: any) => {
                this.user = profile;
                if (this.user.real) {
                    this.real = this.user.real;
                    delete this.user.real;
                } else {
                    this.real = null;
                }
            });
    }

    ngOnDestroy() {
        this.destroySignal$$.next();
        this.destroySignal$$.complete();
    }

    onSearch(): void {
        this.loadData();
    }

    onReset(): void {
        this.model = {} as InsuredEventFilter;
        this.form.reset();
        this.loadData();
    }

    private loadData(): void {
        this.facade
            .load(this.model)
            .pipe(takeUntil(this.destroySignal$$))
            .subscribe((res) => (this.data = res.items));
    }

    /**
     * Преобразует массив строковых значений из API в список SelectOption для
     * билдера
     * @param values Массив строковых значений
     * @private Массив опций
     */
    private mapStringsToOptions(
        values: string[] | undefined | null
    ): SelectOption[] {
        return (values ?? []).map((v) => ({ label: v, value: v }));
    }
}
