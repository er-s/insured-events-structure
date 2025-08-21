/**
 * Словари фильтров
 */
export interface FilterDictionaries {
    /**
     * Виды страхования
     */
    insuranceTypes: string[];

    /**
     * Статусы убытков
     */
    eventStatuses: string[];
}

/**
 * Интерфейс ответа
 */
export interface FilterDictionariesDto {
    data: {
        insuranceKids: string[];
        lossStatuses: string[];
    };
    error: unknown;
    system?: unknown;
}
