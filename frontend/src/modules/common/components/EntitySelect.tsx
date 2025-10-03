import React from "react";

import { Form } from "react-bootstrap";

export interface EntityOption {
  id: number;
  displayText: string;
  additionalInfo?: string;
}

interface EntitySelectProps {
  value: number | string;
  onChange: (value: number | string) => void;
  options: EntityOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  error?: string;
  isLoading?: boolean;
}

export function EntitySelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  required = false,
  disabled = false,
  helpText,
  error,
  isLoading = false,
}: EntitySelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onChange(selectedValue === "" ? "" : Number(selectedValue));
  };

  return (
    <Form.Group>
      {label && (
        <Form.Label>
          {label}
          {required && " *"}
        </Form.Label>
      )}
      <Form.Select
        value={value}
        onChange={handleChange}
        disabled={disabled || isLoading}
        isInvalid={!!error}
      >
        <option value="">{isLoading ? "Loading..." : placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.displayText}
            {option.additionalInfo && ` - ${option.additionalInfo}`}
          </option>
        ))}
      </Form.Select>
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
}
