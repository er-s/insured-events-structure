import { Observable } from 'rxjs';
import { FilterDictionaries } from '../types/dictionary.types';

/**
 * Абстракция источника словарей фильтров
 */
export abstract class DictionaryRepository {
    /**
     * Загрузить словари фильтров
     */
    abstract getFilterDictionary(): Observable<FilterDictionaries>;
}
