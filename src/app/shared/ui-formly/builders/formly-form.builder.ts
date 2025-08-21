import { FormlyFieldConfig } from '@ngx-formly/core';

export interface FieldBuilderContext<TLookups = unknown> {
    lookups?: TLookups;
}

export type FieldFactory<TLookups = unknown> = (
    ctx: FieldBuilderContext<TLookups>
) => FormlyFieldConfig;

export interface SectionOptions {
    className?: string;
}

/**
 * Универсальный билдер для формирования конфигураций Formly форм.
 * Поддерживает секции, словари, грид и фабрики полей.
 */
export class FormlyFormBuilder<TLookups = unknown> {
    private sections: FormlyFieldConfig[] = [];
    private gridColumns = 4;
    private ctx: FieldBuilderContext<TLookups> = {};

    withGrid(columns: number): this {
        this.gridColumns = Math.max(1, columns);
        return this;
    }

    withLookups(lookups: TLookups): this {
        this.ctx.lookups = lookups;
        return this;
    }

    /** Добавить секцию из готовых полей */
    addSection(fields: FormlyFieldConfig[], options?: SectionOptions): this {
        this.sections.push({
            fieldGroupClassName: options?.className ?? this.defaultGridClassName(),
            fieldGroup: fields,
        });
        return this;
    }

    /** Добавить секцию из фабрик полей */
    addSectionByFactories(factories: Array<FieldFactory<TLookups>>, options?: SectionOptions): this {
        const fields = factories.map((f) => f(this.ctx));
        return this.addSection(fields, options);
    }

    build(): FormlyFieldConfig[] {
        return [...this.sections];
    }

    protected defaultGridClassName(): string {
        return `grid grid-${this.gridColumns}`;
    }
}


