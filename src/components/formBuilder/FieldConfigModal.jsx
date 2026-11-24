import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Plus, Trash2, Check, AlertCircle } from 'lucide-react';

const FieldConfigModal = ({ isOpen, onClose, field, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [keyError, setKeyError] = useState('');

  useEffect(() => {
    if (field) {
      setFormData({
        ...field,
        validation: field.validation || {},
        options: field.options ? [...field.options] : []
      });
      setKeyError('');
    }
  }, [field, isOpen]);

  if (!formData) return null;

  const handleKeyChange = (val) => {
    const sanitized = val.replace(/[^a-zA-Z0-9_]/g, '');
    setFormData((prev) => ({ ...prev, key: sanitized }));
    if (!sanitized) {
      setKeyError('Field key is required and cannot be empty');
    } else {
      setKeyError('');
    }
  };

  const handleAddOption = () => {
    const nextIdx = (formData.options?.length || 0) + 1;
    const newOpt = {
      label: `Option ${nextIdx}`,
      value: `option_${nextIdx}`
    };
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOpt]
    }));
  };

  const handleOptionChange = (idx, prop, val) => {
    setFormData((prev) => {
      const nextOpts = [...prev.options];
      nextOpts[idx] = { ...nextOpts[idx], [prop]: val };
      return { ...prev, options: nextOpts };
    });
  };

  const handleRemoveOption = (idx) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.key.trim()) {
      setKeyError('Field key is required');
      return;
    }
    onSave(formData);
    onClose();
  };

  const hasOptions = ['SELECT', 'RADIO', 'CHECKBOX'].includes(formData.type);
  const isTextType = ['TEXT', 'TEXTAREA'].includes(formData.type);
  const isNumberType = formData.type === 'NUMBER';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Field: ${formData.label || formData.type}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Field Label <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Field Key (API identifier) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.key}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="w-full px-3 py-2 font-mono rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
            />
            {keyError && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {keyError}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">Alphanumeric and underscores only (e.g. first_name)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="e.g. Enter your response..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Default Value
            </label>
            <input
              type="text"
              value={formData.defaultValue || ''}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Optional default value"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none"
            />
          </div>
        </div>

        {/* Required switch */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
          <div>
            <span className="text-sm font-bold text-slate-800">Mandatory / Required Field</span>
            <p className="text-xs text-slate-500">Submission will be blocked if left blank</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {/* Options Editor for Select / Radio / Checkbox */}
        {hasOptions && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Configured Choices / Options
                </h4>
                <p className="text-xs text-slate-500">Add options for user selection</p>
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Choice
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {formData.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Display Label"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(idx, 'label', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Value (stored)"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 font-mono text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Validation Rules (Backend & Client)
          </h4>

          {isTextType && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Min Length
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.validation?.minLength ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: {
                        ...formData.validation,
                        minLength: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.validation?.maxLength ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: {
                        ...formData.validation,
                        maxLength: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
            </div>
          )}

          {isNumberType && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={formData.validation?.min ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: {
                        ...formData.validation,
                        min: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={formData.validation?.max ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: {
                        ...formData.validation,
                        max: e.target.value === '' ? null : Number(e.target.value)
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Custom Error Message (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Please enter a valid company employee code"
              value={formData.validation?.customError || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  validation: { ...formData.validation, customError: e.target.value }
                })
              }
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
          >
            <Check className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FieldConfigModal;
