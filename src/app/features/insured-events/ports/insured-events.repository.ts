import { Observable } from 'rxjs';

import type {
    InsuredEvent,
    InsuredEventFilter
} from '../types/insured-event.types';

/**
 * Параметры пагинации для запросов списка
 */
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

/**
 * Результат поиска/списка
 * @typeParam T - тип элементов
 */
export interface SearchResult<T> {
    items: T[];
    total: number;
}

/**
 * Абстракция источника данных
 */
export abstract class InsuredEventsRepository {
    /**
     * Поиск/получение списка событие
     * @param filter - фильтр
     * @param pagination - параметры пагинации
     */
    abstract search(
        filter: InsuredEventFilter,
        pagination?: PaginationParams
    ): Observable<SearchResult<InsuredEvent>>;

    /**
     * @remarks Заготовка для масштаба
     * Получение события по идентификатору
     * @param id
     */
    abstract getById(id: string): Observable<InsuredEvent>;
}
