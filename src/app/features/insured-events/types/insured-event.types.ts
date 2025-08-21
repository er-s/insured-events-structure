/**
 * Базовый тип страхового события
 */
export interface InsuredEvent {
    policyId: string;
    policyNumber: string;
    contractNumber: string;
    insurantFullName: string;
    productName: string;
    eventNumber: string;
    eventStatus: string;
    regressFlag: 'Регресс' | 'Не регресс' | 'Пул'; //Адаптировать под доку
    changedAt: string;
}

/**
 * Фильтры поиска
 */
export interface InsuredEventFilter {
    insuranceType?: string;
    insurant?: string;
    contractNumber?: string;
    eventStatus?: string;
    payoutDecision?: string;
    periodForm?: string;
    periodTo?: string;
}
