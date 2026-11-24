import React from 'react';
import FieldWrapper from '../FieldWrapper';

const PhoneInput = ({ field, value = '', onChange, onBlur, error, touched, disabled }) => {
  const hasError = Boolean(error && touched);

  return (
    <FieldWrapper
      id={field.id || field.key}
      label={field.label}
      required={field.required}
      error={error}
      touched={touched}
      helpText="Include country code, e.g. +1 555-0123"
    >
      <input
        type="tel"
        id={field.id || field.key}
        name={field.key}
        value={value ?? ''}
        placeholder={field.placeholder || '+1 234 567 8900'}
        disabled={disabled}
        onChange={(e) => onChange(field.key, e.target.value)}
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

export default PhoneInput;
