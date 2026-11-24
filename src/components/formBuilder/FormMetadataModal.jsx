import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Check, Building2, User, Mail, Phone } from 'lucide-react';

const FormMetadataModal = ({ isOpen, onClose, metadata, onSave }) => {
  const [formData, setFormData] = useState(metadata || {});

  useEffect(() => {
    if (metadata) {
      setFormData(metadata);
    }
  }, [metadata, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Form Settings & Metadata"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Form Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-50"
            placeholder="e.g. Candidate Technical Evaluation"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Description / Instructions
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-50"
            placeholder="Briefly describe the purpose of this form for respondents..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Department
            </label>
            <input
              type="text"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500"
              placeholder="e.g. Engineering"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Designation
            </label>
            <input
              type="text"
              value={formData.designation || ''}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500"
              placeholder="e.g. Senior Lead"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Role
            </label>
            <input
              type="text"
              value={formData.role || ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500"
              placeholder="e.g. Evaluator"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Creator Email
            </label>
            <input
              type="email"
              value={formData.creatorMail || ''}
              onChange={(e) => setFormData({ ...formData, creatorMail: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Creator Mobile
            </label>
            <input
              type="tel"
              value={formData.creatorMobile || ''}
              onChange={(e) => setFormData({ ...formData, creatorMobile: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500"
              placeholder="+1 555-0199"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Creator Gender
            </label>
            <select
              value={formData.creatorGender || 'Not Specified'}
              onChange={(e) => setFormData({ ...formData, creatorGender: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-brand-500 bg-white"
            >
              <option value="Not Specified">Not Specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
          <div>
            <span className="text-sm font-bold text-slate-800">Form Publishing Status</span>
            <p className="text-xs text-slate-500">Published forms are accessible for submissions via public URL</p>
          </div>
          <select
            value={formData.status || 'draft'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-3 py-1.5 text-xs font-bold uppercase rounded-lg border border-slate-300 bg-white outline-none focus:border-brand-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

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
            <Check className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormMetadataModal;
