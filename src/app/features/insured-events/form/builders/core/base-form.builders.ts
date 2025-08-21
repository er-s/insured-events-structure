import type { FormlyFieldConfig } from '@ngx-formly/core';

import type { FormExpressions, FormFieldProps, FormValidation } from '../index';

export abstract class BaseFormBuilder {
    protected fields: FormlyFieldConfig[] = [];

    /**
     * Добавляет поле в форму
     * @param fieldConfig
     * @protected
     */
    protected addField(fieldConfig: FormlyFieldConfig): this {
        this.fields.push(fieldConfig);

        return this;
    }

    /**
     * Добавляет группу полей с разметкой
     * @param className - стили из css-фреймфорка
     * @param fields
     * @protected
     */
    protected addFieldGroup(
        className: string,
        fields: FormlyFieldConfig[]
    ): this {
        this.fields.push({
            fieldGroupClassName: className,
            fieldGroup: fields
        });

        return this;
    }

    /**
     * Добавялет заголовок
     * @param key - ключ в модели
     * @param label - текст заголовка
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     */
    addHeading(
        key: string,
        label: string,
        className = '',
        props: any = {}
    ): this {
        return this.addField({
            key,
            type: 'formly-heading-component',
            className,
            props: {
                label,
                ...props
            }
        });
    }

    /**
     * Дабавляет текстовое поле
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидация
     * @param expressions - динамические условия
     * @param defaultValue - значение по умолчанию
     */
    addInput(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions,
        defaultValue?: any
    ): this {
        return this.addField({
            key,
            type: 'formly-input-component',
            className,
            defaultValue,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавялет поле выбора (select)
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидации
     * @param expressions - динамические условия
     * @param defaultValue - значения по умолчанию
     */
    addSelect(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions,
        defaultValue?: any
    ): this {
        return this.addField({
            key,
            type: 'formly-float-select',
            className,
            defaultValue,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавялет календарь выбора даты
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидации
     * @param expressions - динамические условия
     * @param type - тип компонента
     */
    addDatePicker(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions,
        type: 'iso' | 'formatted' = 'formatted'
    ): this {
        const fieldType =
            type === 'iso'
                ? 'formly-iso-datepicker-component'
                : 'formly-formatted-datepicker';

        return this.addField({
            key,
            type: fieldType,
            className,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавялем textarea
     * @param key - ключ
     * @param className - стили из css-фреймфорка
     * @param props
     * @param validation
     * @param expressions
     */
    addTextArea(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions
    ): this {
        return this.addField({
            key,
            type: 'formly-textarea-component',
            className,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавляет радио кнопку
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидации
     * @param expressions - динамические условия
     * @param defaultValue - значение по умолчанию
     */
    addRadio(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions,
        defaultValue?: any
    ): this {
        return this.addField({
            key,
            type: 'formly-radio-button',
            className,
            defaultValue,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавялем checkbox
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидации
     * @param expressions - динамические условия
     * @param defaultValue - значение по умолчанию
     */
    addCheckBox(
        key: string,
        className: string,
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions,
        defaultValue?: any
    ): this {
        return this.addField({
            key,
            type: 'formly-checkbox-component',
            className,
            defaultValue,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавяляем компонент загрузки файла
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     * @param validation - параметры валидации
     * @param expressions - динамичсекие условия
     */
    addFileUpload(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions
    ): this {
        return this.addField({
            key,
            type: 'formly-file-upload',
            className,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавляет поле автокомплита
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп пропсы
     * @param validation - параметры валидации
     * @param expressions - динамические условия
     */
    addAutocomplete(
        key: string,
        className = '',
        props: FormFieldProps = {},
        validation?: FormValidation,
        expressions?: FormExpressions
    ): this {
        return this.addField({
            key,
            type: 'formly-autocomplete-select',
            className,
            props,
            validation,
            expressions
        });
    }

    /**
     * Добавляет tooltip
     * @param key - ключ в модели
     * @param className - стили из css-фреймфорка
     * @param props - доп. пропсы
     */
    addTooltip(key: string, className = '', props: FormFieldProps = {}): this {
        return this.addField({
            key: '',
            type: 'formly-tooltip-component',
            className,
            props
        });
    }

    /**
     * Добавляет текстовый элемент
     * @param key
     * @param className
     * @param props
     */
    addText(key: string, className = '', props: FormFieldProps = {}): this {
        return this.addField({
            key,
            type: 'formly-text-component',
            className,
            props
        });
    }

    /**
     * Добавляет link text элемент
     * @param key
     * @param className
     * @param props
     */
    addLinkText(key: string, className = '', props: FormFieldProps = {}): this {
        return this.addField({
            key,
            type: 'formly-link-text-component',
            className,
            props
        });
    }

    /**
     * Добавялем группу полей в ряд (row)
     * @param fields
     */
    addRow(fields: FormlyFieldConfig[]): this {
        return this.addFieldGroup('row', fields);
    }

    /**
     * Добавляет группу полей с произвольным классом
     * @param className
     * @param fields
     */
    addGroup(className: string, fields: FormlyFieldConfig[]): this {
        return this.addFieldGroup(className, fields);
    }

    /**
     * Добавляем произвольное поле
     * @param fieldConfig
     */
    addCustomField(fieldConfig: FormlyFieldConfig): this {
        return this.addField(fieldConfig);
    }

    /**
     * Возвращает итоговую конфигурацию формы
     */
    build(): FormlyFieldConfig[] {
        return [...this.fields];
    }
}
