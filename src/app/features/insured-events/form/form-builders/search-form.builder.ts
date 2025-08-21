import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseFormBuilder } from '../builders/core/base-form.builders';
import type { InsuredEventsFacade } from '../../services';

export interface SelectOption {
    label: string;
    value: string;
}
export interface InsuredEventsSearchLookups {
    insuranceTypes: SelectOption[];
    eventStatuses: SelectOption[];
    payoutDecisions: SelectOption[];
}

/** Билдер формы фильтров страховых событий. */
export class InsuredEventsSearchFormBuilder extends BaseFormBuilder {
    private insuranceTypes: SelectOption[] = [];
    private eventStatuses: SelectOption[] = [];
    private payoutDecisions: SelectOption[] = [];

    /** Создать поля из уже загруженных словарей. */
    static createFilters(
        insuranceTypes: SelectOption[],
        eventStatuses: SelectOption[],
        payoutDecisions: SelectOption[]
    ): FormlyFieldConfig[] {
        return new InsuredEventsSearchFormBuilder()
            .withLookups({ insuranceTypes, eventStatuses, payoutDecisions })
            .buildCompleteFiltersForm();
    }

    /**
     * Асинхронная фабрика: получает словари через фасад и возвращает готовые поля.
     */
    static createFromFacade(
        facade: InsuredEventsFacade
    ): Observable<FormlyFieldConfig[]> {
        return facade.getFilterDictionaries().pipe(
            map((dicts) => {
                const insuranceTypes = this.mapStringsToOptions(
                    dicts.insuranceTypes
                );
                const eventStatuses = this.mapStringsToOptions(
                    dicts.eventStatuses
                );
                const payoutDecisions: SelectOption[] = [];
                return this.createFilters(
                    insuranceTypes,
                    eventStatuses,
                    payoutDecisions
                );
            })
        );
    }

    /**
     * Передать лукапы в билдер.
     */
    withLookups(lookups: InsuredEventsSearchLookups): this {
        this.insuranceTypes = lookups.insuranceTypes;
        this.eventStatuses = lookups.eventStatuses;
        this.payoutDecisions = lookups.payoutDecisions;
        return this;
    }

    /**
     * Добавить поля фильтров.
     */
    addFilters(): this {
        return this.addRow([
            {
                name: 'event',
                type: 'ng-select',
                props: {
                    label: 'Тип события',
                    options: [{ label: '1', value: '1' }]
                }
            }
        ]);
    }

    /**
     * Построить полную форму фильтров.
     */
    buildCompleteFiltersForm(): FormlyFieldConfig[] {
        return this.addFilters().build();
    }

    /** Преобразование строк в опции. */
    private static mapStringsToOptions(
        values: string[] | null | undefined
    ): SelectOption[] {
        return (values ?? []).map((v) => ({ label: v, value: v }));
    }
}
