import React, { useState } from 'react';
import { getFieldComponent } from './FieldRegistry';
import SubmissionSuccessModal from './SubmissionSuccessModal';
import { CheckCircle2, AlertOctagon, Send, Sparkles, Building2, User } from 'lucide-react';

const validateFieldClientSide = (field, value) => {
  const isRequired = !!field.required;
  const isEmpty =
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  if (isRequired && isEmpty) {
    return `${field.label} is required`;
  }

  if (isEmpty) return null;

  const type = String(field.type || '').toUpperCase();
  const validation = field.validation || {};

  switch (type) {
    case 'EMAIL': {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      if (!emailRegex.test(String(value).trim())) {
        return validation.customError || 'Please enter a valid email address';
      }
      break;
    }
    case 'NUMBER': {
      const num = Number(value);
      if (isNaN(num)) {
        return validation.customError || 'Must be a valid number';
      }
      if (validation.min !== null && validation.min !== undefined && num < validation.min) {
        return validation.customError || `Minimum allowed value is ${validation.min}`;
      }
      if (validation.max !== null && validation.max !== undefined && num > validation.max) {
        return validation.customError || `Maximum allowed value is ${validation.max}`;
      }
      break;
    }
    case 'PHONE': {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,16}$/;
      if (!phoneRegex.test(String(value).trim())) {
        return validation.customError || 'Please enter a valid phone number';
      }
      break;
    }
    case 'TEXT':
    case 'TEXTAREA': {
      const str = String(value).trim();
      if (validation.minLength && str.length < validation.minLength) {
        return validation.customError || `Must be at least ${validation.minLength} characters`;
      }
      if (validation.maxLength && str.length > validation.maxLength) {
        return validation.customError || `Cannot exceed ${validation.maxLength} characters`;
      }
      if (validation.pattern) {
        try {
          const regex = new RegExp(validation.pattern);
          if (!regex.test(str)) {
            return validation.customError || 'Invalid format';
          }
        } catch (e) {
          // invalid pattern ignored
        }
      }
      break;
    }
    default:
      break;
  }

  return null;
};

const DynamicFormRenderer = ({
  form,
  values,
  errors = {},
  touched = {},
  onChange,
  onBlur,
  onSubmit,
  submitting = false,
  isPreview = false,
  submitSuccess = false,
  submissionId = null,
  submittedRecord = null,
  onReset,
  onCloseModal
}) => {
  const [localErrors, setLocalErrors] = useState({});

  if (!form) return null;

  const fields = [...(form.fields || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleChange = (key, val) => {
    if (onChange) onChange(key, val);
    if (localErrors[key]) {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleBlur = (key) => {
    if (onBlur) onBlur(key);
    const field = fields.find((f) => f.key === key);
    if (field) {
      const err = validateFieldClientSide(field, values[key]);
      if (err) {
        setLocalErrors((prev) => ({ ...prev, [key]: err }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run client-side validation on all fields
    const newErrors = {};
    fields.forEach((field) => {
      const err = validateFieldClientSide(field, values[field.key]);
      if (err) {
        newErrors[field.key] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      // Mark all fields touched
      fields.forEach((f) => {
        if (onBlur) onBlur(f.key);
      });
      return;
    }

    if (onSubmit) {
      onSubmit(values);
    }
  };

  // Merge server errors and client errors
  const mergedErrors = { ...localErrors, ...errors };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 p-6 sm:p-8 text-white">
        {isPreview && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-950 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Live Preview Mode
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {form.name || 'Untitled Form'}
        </h1>
        {form.description && (
          <p className="text-indigo-100 text-sm leading-relaxed whitespace-pre-line mb-4">
            {form.description}
          </p>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-100/90 pt-2 border-t border-indigo-500/30">
          {form.department && (
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
              <Building2 className="w-3.5 h-3.5 text-indigo-200" />
              {form.department}
            </span>
          )}
          {form.designation && (
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-sm">
              <User className="w-3.5 h-3.5 text-indigo-200" />
              {form.designation} {form.role ? `• ${form.role}` : ''}
            </span>
          )}
          <span className="ml-auto text-indigo-200 font-medium">
            {fields.length} {fields.length === 1 ? 'Field' : 'Fields'}
          </span>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {Object.keys(mergedErrors).length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertOctagon className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-900 mb-0.5">Please correct the highlighted errors before submitting:</p>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                {Object.entries(mergedErrors).map(([key, msg]) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {fields.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No fields have been added to this form yet.</p>
          </div>
        ) : (
          fields.map((field) => {
            const FieldComponent = getFieldComponent(field.type);
            return (
              <FieldComponent
                key={field.id || field.key}
                field={field}
                value={values[field.key]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={mergedErrors[field.key]}
                touched={touched[field.key] || Boolean(mergedErrors[field.key])}
                disabled={submitting}
              />
            );
          })
        )}

        {fields.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting Response...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Response</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>

    {/* Submission Details Popup / Modal */}
    <SubmissionSuccessModal
      isOpen={submitSuccess}
      onClose={onCloseModal || onReset}
      form={form}
      submittedData={submittedRecord?.data || values}
      submissionId={submissionId}
      onSubmitAnother={onReset}
    />
  </>
);
};

export default DynamicFormRenderer;
