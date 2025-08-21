import { DictionaryRepository } from '../../ports/dictionaries.repository';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
    FilterDictionaries,
    FilterDictionariesDto
} from '../../types/dictionary.types';

/**
 * HTTP-реализавция репозитория словарей фильтров.
 */
export class DictionariesHttpRepository implements DictionaryRepository {
    constructor(private readonly http: HttpClient) {}

    /**
     * @inheritdoc
     */
    getFilterDictionary(): Observable<FilterDictionaries> {
        return this.http
            .get<FilterDictionariesDto>(
                'api/service/reports/api/v1/damages/filter-dictionaries'
            )
            .pipe(
                map((r) => ({
                    insuranceTypes: r?.data?.insuranceKids ?? [],
                    eventStatuses: r?.data?.lossStatuses ?? []
                }))
            );
    }
}
