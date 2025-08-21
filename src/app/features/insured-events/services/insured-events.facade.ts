import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import type { PaginationParams } from '../ports/insured-events.repository';
import type {
    InsuredEvent,
    InsuredEventFilter
} from '../types/insured-event.types';
import { InsuredEventsService } from './insured-events.service';
import { FilterDictionaries } from '../types/dictionary.types';

/**
 * Фасад для компонентов UI. Предоставляет простой API для работы c модулем,
 * скрывая внутренние детали сервиса/репозитория и упрощая тестирование компонентов.
 */
@Injectable({ providedIn: 'root' })
export class InsuredEventsFacade {
    constructor(
        @Inject(InsuredEventsService)
        private readonly service: InsuredEventsService
    ) {}

    /** Загрузить список с фильтром и пагинацией. */
    load(
        filter: InsuredEventFilter,
        pagination?: PaginationParams
    ): Observable<{ items: InsuredEvent[]; total: number }> {
        return this.service.getEvents(filter, pagination);
    }

    /** Получить детальную информацию по идентификатору. */
    getById(id: string): Observable<InsuredEvent> {
        return this.service.getEventById(id);
    }

    /**
     * Получить словари фильтров
     */
    getFilterDictionaries(): Observable<FilterDictionaries> {
        return this.service.getFilterDictionaries();
    }
}
