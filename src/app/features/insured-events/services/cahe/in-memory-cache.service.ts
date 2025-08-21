import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class InMemoryCacheService<T> {
    private readonly store = new Map<
        string,
        { value: T; expiresAt?: number }
    >();

    /**
     * Сохоранить значение в кэш
     * @param key - ключ
     * @param value - значение
     * @param ttlMs - время дизни в мс
     */
    set(key: string, value: T, ttlMs?: number): void {
        this.store.set(key, {
            value,
            expiresAt: ttlMs ? Date.now() + ttlMs : undefined
        });
    }

    /**
     * Получить значение их кэша по ключу
     * @param key
     */
    get(key: string): T | undefined {
        const item = this.store.get(key);
        if (!item) return undefined;
        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.store.delete(key);

            return undefined;
        }

        return item.value;
    }
}
