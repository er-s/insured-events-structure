import type { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { of } from 'rxjs';

import type {
    InsuredEventsRepository,
    PaginationParams,
    SearchResult
} from '../../ports/insured-events.repository';
import type {
    InsuredEvent,
    InsuredEventFilter
} from '../../types/insured-event.types';
import type { InMemoryCacheService } from '../cahe/in-memory-cache.service';

/**
 * Декоратор-репозиторий с in-memory кэшем результатов поиска и деталей.
 * Не  меняет поведение базовой реализации, только добавляет кэширование.
 */
export class CachedInsuredEventsRepository implements InsuredEventsRepository {
    private readonly searchTtlMs = 30_000;
    private readonly detailsTtlMs = 60_000;

    constructor(
        private readonly inner: InsuredEventsRepository,
        private readonly cache: InMemoryCacheService<any>
    ) {}

    search(
        filter: InsuredEventFilter,
        pagination?: PaginationParams
    ): Observable<SearchResult<InsuredEvent>> {
        const key = `search: ${JSON.stringify({ filter, pagination })}`;
        const cached: SearchResult<InsuredEvent> | undefined =
            this.cache.get(key);

        if (cached) {
            return of(cached);
        }

        return this.inner
            .search(filter, pagination)
            .pipe(tap((res) => this.cache.set(key, res, this.searchTtlMs)));
    }

    getById(id: string): Observable<InsuredEvent> {
        const key = `byId:${id}`;
        const cached: InsuredEvent | undefined = this.cache.get(key);

        if (cached) {
            return of(cached);
        }

        return this.inner
            .getById(id)
            .pipe(tap((res) => this.cache.set(key, res, this.detailsTtlMs)));
    }
}
