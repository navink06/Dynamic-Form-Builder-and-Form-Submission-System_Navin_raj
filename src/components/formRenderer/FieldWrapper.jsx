import React from 'react';
import { AlertCircle } from 'lucide-react';

const FieldWrapper = ({
  id,
  label,
  required,
  error,
  touched,
  helpText,
  children
}) => {
  const hasError = Boolean(error && touched);

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-800"
        >
          {label}
          {required && <span className="ml-1 text-rose-500 font-bold">*</span>}
        </label>
      </div>

      {children}

      {helpText && !hasError && (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      )}

      {hasError && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FieldWrapper;
