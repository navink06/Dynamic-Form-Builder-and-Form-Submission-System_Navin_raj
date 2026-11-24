import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2, Calendar, Hash, FileText, RotateCcw, X, ShieldCheck } from 'lucide-react';

const SubmissionSuccessModal = ({
  isOpen,
  onClose,
  form,
  submittedData,
  submissionId,
  onSubmitAnother
}) => {
  if (!isOpen) return null;

  const fields = form?.fields || [];
  const data = submittedData || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Form Submission Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Submission Confirmed!
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Your response for <span className="font-bold text-slate-900">"{form?.name || 'Dynamic Form'}"</span> has been recorded in the database.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-500 font-mono">
            {submissionId && (
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span>ID: {submissionId}</span>
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
            Submitted Details Summary
          </h4>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white max-h-72 overflow-y-auto">
            {fields.map((field) => {
              const rawVal = data[field.key];
              let renderedVal = '—';

              if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                if (Array.isArray(rawVal)) {
                  renderedVal = rawVal.length > 0 ? rawVal.join(', ') : '—';
                } else if (field.type === 'DATE') {
                  renderedVal = new Date(rawVal).toLocaleDateString();
                } else {
                  renderedVal = String(rawVal);
                }
              }

              return (
                <div key={field.key} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs hover:bg-slate-50 transition-colors">
                  <div className="w-full sm:w-2/5">
                    <span className="font-bold text-slate-800">{field.label}</span>
                    <span className="block font-mono text-[10px] text-slate-400">{field.key}</span>
                  </div>
                  <div className="w-full sm:w-3/5 font-semibold text-slate-900 break-words">
                    {renderedVal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validated & Encrypted</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>

            {onSubmitAnother && (
              <button
                type="button"
                onClick={onSubmitAnother}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Submit Another Response
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionSuccessModal;
