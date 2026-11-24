import React from 'react';
import FieldWrapper from '../FieldWrapper';

const NumberInput = ({ field, value = '', onChange, onBlur, error, touched, disabled }) => {
  const hasError = Boolean(error && touched);
  const min = field.validation?.min;
  const max = field.validation?.max;

  let helpText = '';
  if (min !== null && min !== undefined && max !== null && max !== undefined) {
    helpText = `Between ${min} and ${max}`;
  } else if (min !== null && min !== undefined) {
    helpText = `Minimum ${min}`;
  } else if (max !== null && max !== undefined) {
    helpText = `Maximum ${max}`;
  }

  return (
    <FieldWrapper
      id={field.id || field.key}
      label={field.label}
      required={field.required}
      error={error}
      touched={touched}
      helpText={helpText}
    >
      <input
        type="number"
        id={field.id || field.key}
        name={field.key}
        value={value ?? ''}
        placeholder={field.placeholder || 'Enter a number...'}
        min={min !== null ? min : undefined}
        max={max !== null ? max : undefined}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
        onBlur={() => onBlur(field.key)}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
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

export default NumberInput;
