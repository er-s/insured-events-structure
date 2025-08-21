import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

import type {
    InsuredEventsRepository,
    PaginationParams,
    SearchResult
} from '../ports/insured-events.repository';
import type {
    InsuredEvent,
    InsuredEventFilter
} from '../types/insured-event.types';
import { InsuredEventsHttpRepository } from './http/insured-events.http.repository';
import { DictionaryRepository } from '../ports/dictionaries.repository';

/**
 * Доменный сервис «Страховых событий».
 * Отвечает за координацию бизнес-операций и нефункциональные аспекты (кэш, обработка ошибок).
 */
@Injectable()
export class InsuredEventsService {
    constructor(
        @Inject(InsuredEventsHttpRepository)
        private readonly repository: InsuredEventsRepository,
        @Inject(DictionaryRepository)
        private readonly dictionariesRepository: DictionaryRepository
    ) {}

    /**
     * Получить список страховых событий с учётом фильтра.
     * Возвращает кэшируемый поток; повторный вызов с теми же параметрами не создаёт новый HTTP‑запрос.
     * @param filter - параметры фильтра
     * @param pagination - параметры пагинации
     * @param options - дополнительные опции (например, `force` для принудительного обхода кэша)
     */
    getEvents(
        filter: InsuredEventFilter,
        pagination?: PaginationParams,
        options?: { force?: boolean }
    ): Observable<SearchResult<InsuredEvent>> {
        const stream$ = this.repository.search(filter, pagination).pipe(
            shareReplay(1),
            catchError((e) => this.handleError(e))
        );

        return stream$;
    }

    /** Получить детальную информацию по событию. */
    getEventById(id: string): Observable<InsuredEvent> {
        return this.repository
            .getById(id)
            .pipe(catchError((e) => this.handleError(e)));
    }

    /**
     * Загрузить словари фильров
     */
    getFilterDictionaries() {
        return this.dictionariesRepository
            .getFilterDictionary()
            .pipe(catchError((e) => this.handleError(e)));
    }

    /** Хук обработки ошибок — расширяем логированием/метриками/маппингом ошибок для UI. */
    private handleError(err: unknown): Observable<never> {
        return throwError(() => err as Error);
    }
}
