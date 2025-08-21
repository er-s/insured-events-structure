import type { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type {
    InsuredEventsRepository,
    PaginationParams,
    SearchResult
} from '../../ports/insured-events.repository';
import type {
    InsuredEvent,
    InsuredEventFilter
} from '../../types/insured-event.types';
import type { InsuredEventDto } from './mappers/insured-events.mapper';
import { mapInsuredEventDto } from './mappers/insured-events.mapper';
import { Inject } from '@angular/core';

interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

/**
 * HTTP-реализация реаозитория страховых событий.
 * Инкапсулирует дутали транспорта и преобразование данных.
 */
export class InsuredEventsHttpRepository implements InsuredEventsRepository {
    constructor(private readonly http: HttpClient) {}

    /**
     * @inheritdoc
     */
    search(
        filter: InsuredEventFilter,
        pagination?: PaginationParams
    ): Observable<SearchResult<InsuredEvent>> {
        let params = new HttpParams();
        Object.entries(filter || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });

        if (pagination?.page)
            params = params.set('page', String(pagination.page));

        if (pagination?.pageSize)
            params = params.set('pageSize', String(pagination.pageSize));

        return this.http
            .get<
                PaginatedResponse<InsuredEventDto>
            >('/api/insured-events', { params })
            .pipe(
                map((r: PaginatedResponse<InsuredEventDto>) => ({
                    items: r.items.map(mapInsuredEventDto),
                    total: r.total
                }))
            );
    }

    /**
     * @inheritdoc
     */
    getById(id: string): Observable<InsuredEvent> {
        return this.http
            .get<InsuredEventDto>(`/api/insured-events/${id}`)
            .pipe(map(mapInsuredEventDto));
    }
}
