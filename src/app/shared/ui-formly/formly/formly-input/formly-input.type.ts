import { MaskPatternItem } from '../../../../core/services/validation/interfaces/mask-config.interface';

export interface CustomTemplateOptions {
  type?: string;
  mask?: string;
  pattern?: string | RegExp;
  patternError?: string;
  customPatterns?: { [key: string]: RegExp };
  isDisabled?: boolean;
  maxlength?: number;
  minLength?: number;
  prefix?: string | null;
  prefillValue?: string;
  errorMessage?: string;
  errorDescription?: string;
  label?: string;
  placeholder?: string;
  maskOptions?: {
    mask: string;
    patterns?: { [character: string]: MaskPatternItem };
    dropSpecialCharacters?: boolean;
    showMaskTyped?: boolean;
    clearIfNotMatch?: boolean;
  };
  validationType?: string | (() => string);
  restrictions?: string;
  helperText?: string;
}
