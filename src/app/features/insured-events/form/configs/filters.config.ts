import type { FormlyFieldConfig } from '@ngx-formly/core';

import type { SelectOption } from '../form-builders/search-form.builder';
import { InsuredEventsSearchFormBuilder } from '../form-builders/search-form.builder';

export function filtersConfig(
    insuranceTypes: SelectOption[],
    eventStatuses: SelectOption[],
    payoutDecisions: SelectOption[]
): FormlyFieldConfig[] {
    return InsuredEventsSearchFormBuilder.createFilters(
        insuranceTypes,
        eventStatuses,
        payoutDecisions
    );
}
