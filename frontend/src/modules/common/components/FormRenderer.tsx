// src/modules/common/components/FormRenderer.tsx
import React from 'react';

interface FormRendererProps<T> {
    formFields: Array<{
        key: keyof T;
        label: string;
        type: 'text' | 'number';
    }>;
    form: Partial<T>;
    setForm: (form: Partial<T>) => void;
}

export function FormRenderer<T>({ formFields, form, setForm }: FormRendererProps<T>) {
    return (
        <form className="vstack gap-3">
            {formFields.map((field) => (
                <div key={String(field.key)}>
                    <label className="form-label">{field.label}</label>
                    {field.type === 'number' ? (
                        <input
                            type="number"
                            className="form-control"
                            value={form[field.key] ?? ''}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    [field.key]: e.target.value === '' ? null : Number(e.target.value),
                                })
                            }
                        />
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            value={form[field.key] ?? ''}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    [field.key]: e.target.value,
                                })
                            }
                        />
                    )}
                </div>
            ))}
        </form>
    );
}