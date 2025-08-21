import { DictionaryRepository } from '../../ports/dictionaries.repository';
import { InMemoryCacheService } from '../cahe/in-memory-cache.service';
import { FilterDictionaries } from '../../types/dictionary.types';
import { Observable, of, tap } from 'rxjs';

/**
 * Кэширующий декоратор для словарей фильров
 */
export class CachedDictionaryRepository implements DictionaryRepository {
    private readonly ttlMs = 5 * 60_000;

    constructor(
        private readonly inner: DictionaryRepository,
        private readonly cache: InMemoryCacheService<FilterDictionaries>
    ) {}

    getFilterDictionary(): Observable<FilterDictionaries> {
        const key = 'filter-dictionaries';
        const cached = this.cache.get(key);

        if (cached) return of(cached);

        return this.inner
            .getFilterDictionary()
            .pipe(tap((res) => this.cache.set(key, res, this.ttlMs)));
    }
}
