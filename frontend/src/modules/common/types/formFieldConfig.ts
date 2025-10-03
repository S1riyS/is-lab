// src/modules/common/types/formFieldConfig.ts

// Base field configuration
interface BaseFieldConfig<T> {
  key: keyof T | string; // Allow string for fields that might not be in the main DTO but exist in create/update DTOs
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
}

// Specific field type configurations
interface TextFieldConfig<T> extends BaseFieldConfig<T> {
  type: "text";
  maxLength?: number;
  minLength?: number;
}

interface EmailFieldConfig<T> extends BaseFieldConfig<T> {
  type: "email";
}

interface PasswordFieldConfig<T> extends BaseFieldConfig<T> {
  type: "password";
  minLength?: number;
}

interface NumberFieldConfig<T> extends BaseFieldConfig<T> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

interface TextareaFieldConfig<T> extends BaseFieldConfig<T> {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

interface BooleanFieldConfig<T> extends BaseFieldConfig<T> {
  type: "boolean";
}

interface SelectFieldConfig<T> extends BaseFieldConfig<T> {
  type: "select";
  options: Array<{ value: string | number; label: string }>;
  multiple?: boolean;
}

interface DateFieldConfig<T> extends BaseFieldConfig<T> {
  type: "date";
}

interface DateTimeFieldConfig<T> extends BaseFieldConfig<T> {
  type: "datetime";
  showTime?: boolean;
  format?: string; // ISO format by default
}

interface TimeFieldConfig<T> extends BaseFieldConfig<T> {
  type: "time";
}

interface EntitySelectFieldConfig<T> extends BaseFieldConfig<T> {
  type: "entity-select";
  entityType: "person" | "event" | "venue" | "coordinates" | "location";
}

export type FormFieldConfig<T> =
  | TextFieldConfig<T>
  | EmailFieldConfig<T>
  | PasswordFieldConfig<T>
  | NumberFieldConfig<T>
  | TextareaFieldConfig<T>
  | BooleanFieldConfig<T>
  | SelectFieldConfig<T>
  | DateFieldConfig<T>
  | DateTimeFieldConfig<T>
  | TimeFieldConfig<T>
  | EntitySelectFieldConfig<T>;
