// src/modules/common/components/FormRenderer.tsx
import { Form } from "react-bootstrap";

import {
  useCoordinatesOptions,
  useEventOptions,
  useLocationOptions,
  usePersonOptions,
  useVenueOptions,
} from "@common/hooks/useEntityOptions";
import type { FormFieldConfig } from "@common/types/formFieldConfig";

import { EntityOption, EntitySelect } from "./EntitySelect";

interface FormRendererProps<T> {
  formFields: FormFieldConfig<T>[];
  form: Partial<T>;
  setForm: (form: Partial<T>) => void;
}

export function FormRenderer<T>({
  formFields,
  form,
  setForm,
}: FormRendererProps<T>) {
  const handleFieldChange = (fieldKey: keyof T | string, value: any) => {
    setForm({
      ...form,
      [fieldKey]: value,
    });
  };

  const formatDateTime = (value: string | null | undefined): string => {
    if (!value) return "";
    try {
      // Handle both ISO strings and partial dates
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      // Return in local time format suitable for datetime-local input
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return value || "";
    }
  };

  const parseDateTime = (value: string): string | null => {
    if (!value) return null;
    try {
      // Convert datetime-local format to ISO string
      // The datetime-local input provides local time, so we need to convert it properly
      const localDate = new Date(value);
      return localDate.toISOString();
    } catch {
      return value;
    }
  };

  const renderField = (field: FormFieldConfig<T>) => {
    const fieldValue = form[field.key as keyof T];
    const fieldId = `field-${String(field.key)}`;

    switch (field.type) {
      case "text":
        return (
          <Form.Control
            type="text"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            maxLength={field.maxLength}
            minLength={field.minLength}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "email":
        return (
          <Form.Control
            type="email"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "password":
        return (
          <Form.Control
            type="password"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            minLength={field.minLength}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "number":
        return (
          <Form.Control
            type="number"
            id={fieldId}
            value={(fieldValue as number) ?? ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => {
              const value = e.target.value;
              handleFieldChange(field.key, value === "" ? null : Number(value));
            }}
          />
        );

      case "textarea":
        return (
          <Form.Control
            as="textarea"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            rows={field.rows ?? 3}
            maxLength={field.maxLength}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "boolean":
        return (
          <Form.Check
            type="checkbox"
            id={fieldId}
            checked={(fieldValue as boolean) ?? false}
            disabled={field.disabled}
            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
          />
        );

      case "select":
        return (
          <Form.Select
            id={fieldId}
            value={(fieldValue as string | number) ?? ""}
            disabled={field.disabled}
            required={field.required}
            multiple={field.multiple}
            onChange={(e) => {
              const value = e.target.value;
              if (field.multiple) {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                handleFieldChange(field.key, selectedOptions);
              } else {
                handleFieldChange(field.key, value || null);
              }
            }}
          >
            {!field.required && !field.multiple && (
              <option value="">-- Select {field.label} --</option>
            )}
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case "date":
        return (
          <Form.Control
            type="date"
            id={fieldId}
            value={fieldValue ? String(fieldValue).split("T")[0] : ""}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "datetime":
        return (
          <Form.Control
            type="datetime-local"
            id={fieldId}
            value={formatDateTime(fieldValue as string)}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) =>
              handleFieldChange(field.key, parseDateTime(e.target.value))
            }
          />
        );

      case "time":
        return (
          <Form.Control
            type="time"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            disabled={field.disabled}
            required={field.required}
            onChange={(e) =>
              handleFieldChange(field.key, e.target.value || null)
            }
          />
        );

      case "entity-select":
        const entitySelectField = field as any; // Type assertion for entity-select field
        let entityOptions: EntityOption[] = [];
        let isLoading = false;
        let error: any;

        switch (entitySelectField.entityType) {
          case "person":
            const personData = usePersonOptions();
            entityOptions = personData.options;
            isLoading = personData.isLoading;
            error = personData.error;
            break;
          case "event":
            const eventData = useEventOptions();
            entityOptions = eventData.options;
            isLoading = eventData.isLoading;
            error = eventData.error;
            break;
          case "venue":
            const venueData = useVenueOptions();
            entityOptions = venueData.options;
            isLoading = venueData.isLoading;
            error = venueData.error;
            break;
          case "coordinates":
            const coordinatesData = useCoordinatesOptions();
            entityOptions = coordinatesData.options;
            isLoading = coordinatesData.isLoading;
            error = coordinatesData.error;
            break;
          case "location":
            const locationData = useLocationOptions();
            entityOptions = locationData.options;
            isLoading = locationData.isLoading;
            error = locationData.error;
            break;
          default:
            entityOptions = [];
        }

        return (
          <EntitySelect
            value={(fieldValue as number) ?? ""}
            onChange={(value) => handleFieldChange(field.key, value)}
            options={entityOptions}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            helpText={field.helpText}
            error={error ? "Failed to load options" : undefined}
            isLoading={isLoading}
          />
        );

      default:
        return (
          <Form.Control
            type="text"
            id={fieldId}
            value={(fieldValue as string) ?? ""}
            onChange={(e) =>
              handleFieldChange((field as any).key, e.target.value || null)
            }
          />
        );
    }
  };

  return (
    <Form className="vstack gap-3">
      {formFields.map((field) => (
        <div key={String(field.key)}>
          <Form.Label htmlFor={`field-${String(field.key)}`}>
            {field.label}
            {field.required && <span className="text-danger ms-1">*</span>}
          </Form.Label>
          {renderField(field)}
          {field.helpText && field.type !== "entity-select" && (
            <Form.Text className="text-muted">{field.helpText}</Form.Text>
          )}
        </div>
      ))}
    </Form>
  );
}
