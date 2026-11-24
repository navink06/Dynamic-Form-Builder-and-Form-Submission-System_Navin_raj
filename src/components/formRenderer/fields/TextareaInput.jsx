import React from 'react';
import FieldWrapper from '../FieldWrapper';

const TextareaInput = ({ field, value = '', onChange, onBlur, error, touched, disabled }) => {
  const hasError = Boolean(error && touched);
  const maxLength = field.validation?.maxLength;

  return (
    <FieldWrapper
      id={field.id || field.key}
      label={field.label}
      required={field.required}
      error={error}
      touched={touched}
      helpText={maxLength ? `Max ${maxLength} characters` : ''}
    >
      <textarea
        id={field.id || field.key}
        name={field.key}
        value={value ?? ''}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
        rows={4}
        maxLength={maxLength || undefined}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
        onBlur={() => onBlur(field.key)}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white resize-y
          ${
            hasError
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-50'
              : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50'
          }
          disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
      />
    </FieldWrapper>
  );
};

export default TextareaInput;
