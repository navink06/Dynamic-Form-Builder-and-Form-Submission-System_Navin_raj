import React from 'react';
import FieldWrapper from '../FieldWrapper';

const RadioGroupInput = ({ field, value = '', onChange, onBlur, error, touched, disabled }) => {
  const options = field.options || [];

  return (
    <FieldWrapper
      id={field.id || field.key}
      label={field.label}
      required={field.required}
      error={error}
      touched={touched}
    >
      <div className="space-y-2.5 pt-1">
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          const isChecked = String(value) === String(optValue);

          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-pointer transition-all
                ${
                  isChecked
                    ? 'border-brand-500 bg-brand-50/50 text-brand-950 font-medium ring-1 ring-brand-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }
                ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={field.key}
                value={optValue}
                checked={isChecked}
                disabled={disabled}
                onChange={() => onChange(field.key, optValue)}
                onBlur={() => onBlur(field.key)}
                className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
      </div>
    </FieldWrapper>
  );
};

export default RadioGroupInput;
