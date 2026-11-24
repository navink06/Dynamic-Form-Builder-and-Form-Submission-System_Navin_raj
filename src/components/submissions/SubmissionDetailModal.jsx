import React from 'react';
import Modal from '../common/Modal';
import { Calendar, Monitor, Globe, Clock, FileText } from 'lucide-react';

const SubmissionDetailModal = ({ isOpen, onClose, submission, form }) => {
  if (!submission) return null;

  const data = submission.data || {};
  const metadata = submission.metadata || {};
  const fields = form?.fields || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submission Record Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Metadata Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted At</span>
              <span>{new Date(submission.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Client IP</span>
              <span className="font-mono">{metadata.ip || 'Unknown'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 truncate">
            <Monitor className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">User Agent</span>
              <span className="truncate block" title={metadata.userAgent}>
                {metadata.userAgent || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Fields Data Viewer */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-brand-600" />
            Submitted Form Values
          </h4>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
            {fields.map((field) => {
              const rawVal = data[field.key];
              let displayVal = '—';

              if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                if (Array.isArray(rawVal)) {
                  displayVal = rawVal.join(', ');
                } else if (field.type === 'DATE') {
                  displayVal = new Date(rawVal).toLocaleDateString();
                } else {
                  displayVal = String(rawVal);
                }
              }

              return (
                <div key={field.key} className="p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <div className="w-full sm:w-1/3">
                    <span className="font-semibold text-slate-700">{field.label}</span>
                    <span className="block font-mono text-[11px] text-slate-400">{field.key}</span>
                  </div>
                  <div className="w-full sm:w-2/3 text-slate-900 break-words font-medium">
                    {displayVal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionDetailModal;
