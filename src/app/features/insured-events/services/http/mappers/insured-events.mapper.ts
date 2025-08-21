import { InsuredEvent } from '../../../types/insured-event.types';

/**
 * DTO страхового события, приходящего с бэкенда
 */
export interface InsuredEventDto {
    policyId: string;
    policyNumber: string;
    contractNumber: string;
    insurantFullName: string;
    productName: string;
    eventNumber: string;
    eventStatus: string;
    regressFlag: string;
    changedAt: string;
}

/**
 * Маппинг DTO -> модель.
 * @param dto - DTO
 * @returns модель
 */
export function mapInsuredEventDto(dto: InsuredEventDto): InsuredEvent {
    return {
        policyId: dto.policyId,
        policyNumber: dto.policyNumber,
        contractNumber: dto.contractNumber,
        insurantFullName: dto.insurantFullName,
        productName: dto.productName,
        eventNumber: dto.eventNumber,
        eventStatus: dto.eventStatus,
        regressFlag: dto.regressFlag as any,
        changedAt: dto.changedAt
    };
}
