export interface FormFieldProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: any; label: string; [key: string]: any }>;
}
export interface FormValidation {
  message?: { [key: string]: string };
  [key: string]: any;
}

export interface FormExpressions {
  [key: string]: string | ((field: any) => any);
}
