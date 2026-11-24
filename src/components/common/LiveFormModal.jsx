import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getFieldComponent } from '../formRenderer/FieldRegistry';
import { formsApi } from '../../api/formsApi';
import { submissionsApi } from '../../api/submissionsApi';
import {
  Send,
  CheckCircle2,
  AlertOctagon,
  Building2,
  User,
  RotateCcw,
  Sparkles,
  Hash,
  Calendar,
  FileText,
  ShieldCheck
} from 'lucide-react';

const validateField = (field, value) => {
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
          // ignore invalid pattern
        }
      }
      break;
    }
    default:
      break;
  }

  return null;
};

const LiveFormModal = ({
  isOpen,
  onClose,
  form: initialForm,
  formId,
  onSubmissionSuccess
}) => {
  const [form, setForm] = useState(initialForm || null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Initialize or fetch form definition when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSubmitSuccess(false);
      setSubmittedRecord(null);
      setErrors({});
      setTouched({});
      setServerError(null);
      return;
    }

    const initValues = (formDef) => {
      const defaults = {};
      (formDef.fields || []).forEach((f) => {
        defaults[f.key] =
          f.defaultValue !== null && f.defaultValue !== undefined
            ? f.defaultValue
            : f.type === 'CHECKBOX'
            ? []
            : '';
      });
      setValues(defaults);
      setErrors({});
      setTouched({});
      setSubmitSuccess(false);
      setSubmittedRecord(null);
      setServerError(null);
    };

    if (initialForm && initialForm._id === formId) {
      setForm(initialForm);
      initValues(initialForm);
    } else if (formId) {
      setLoading(true);
      formsApi
        .fetchFormById(formId, true)
        .then((res) => {
          setForm(res.data);
          initValues(res.data);
        })
        .catch((err) => {
          setServerError(err.message || 'Failed to load form definition');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, formId, initialForm]);

  if (!isOpen) return null;

  const fields = [...(form?.fields || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleBlur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const field = fields.find((f) => f.key === key);
    if (field) {
      const err = validateField(field, values[key]);
      if (err) {
        setErrors((prev) => ({ ...prev, [key]: err }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run client validation across all fields
    const newErrors = {};
    fields.forEach((field) => {
      const err = validateField(field, values[field.key]);
      if (err) {
        newErrors[field.key] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all fields touched
      const allTouched = {};
      fields.forEach((f) => (allTouched[f.key] = true));
      setTouched(allTouched);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const targetId = formId || form?._id;
      const response = await submissionsApi.submitForm(targetId, values);
      setSubmittedRecord(response.data);
      setSubmitSuccess(true);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(response.data);
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
      setServerError(err.message || 'Form submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.key] =
        f.defaultValue !== null && f.defaultValue !== undefined
          ? f.defaultValue
          : f.type === 'CHECKBOX'
          ? []
          : '';
    });
    setValues(defaults);
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
    setSubmittedRecord(null);
    setServerError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={form?.name ? `Live Form: ${form.name}` : 'Live Form Modal'}
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading live form schema...</p>
        </div>
      ) : submitSuccess ? (
        /* SUCCESS VIEW INSIDE THE POPUP MODAL */
        <div className="space-y-6 animate-fadeIn py-2">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Submission Confirmed!
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your response for <span className="font-bold text-slate-900">"{form?.name}"</span> has been recorded in the database.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-3.5 text-xs text-slate-500 font-mono">
              {submittedRecord?._id && (
                <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                  <Hash className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ID: {submittedRecord._id}</span>
                </span>
              )}
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
          </div>

          {/* Submitted Values Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-600" />
              Submitted Form Values
            </h4>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white max-h-64 overflow-y-auto">
              {fields.map((f) => {
                const raw = submittedRecord?.data?.[f.key] ?? values[f.key];
                let rendered = '—';
                if (raw !== undefined && raw !== null && raw !== '') {
                  if (Array.isArray(raw)) {
                    rendered = raw.length > 0 ? raw.join(', ') : '—';
                  } else if (f.type === 'DATE') {
                    rendered = new Date(raw).toLocaleDateString();
                  } else {
                    rendered = String(raw);
                  }
                }

                return (
                  <div key={f.key} className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-slate-50">
                    <div className="w-full sm:w-2/5">
                      <span className="font-bold text-slate-800">{f.label}</span>
                      <span className="block font-mono text-[10px] text-slate-400">{f.key}</span>
                    </div>
                    <div className="w-full sm:w-3/5 font-semibold text-slate-900 break-words">
                      {rendered}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submission stored in MongoDB</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Modal
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Submit Another
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE FORM FILLING & VALIDATION INSIDE MODAL */
        <div className="space-y-5">
          {/* Form Meta Header in Modal */}
          {form?.description && (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {form.description}
            </p>
          )}

          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No dynamic fields configured for this form yet.
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
                    error={errors[field.key]}
                    touched={touched[field.key]}
                    disabled={submitting}
                  />
                );
              })
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || fields.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default LiveFormModal;
