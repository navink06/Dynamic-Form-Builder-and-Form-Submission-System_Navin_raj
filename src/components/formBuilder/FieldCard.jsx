import React from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Settings2,
  Trash2,
  Asterisk,
  Layers
} from 'lucide-react';

const FieldCard = ({
  field,
  index,
  totalFields,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-xl border transition-all cursor-pointer p-4
        ${
          isSelected
            ? 'border-brand-500 ring-2 ring-brand-100 shadow-md bg-brand-50/10'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Reorder & Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="text-slate-300 group-hover:text-slate-500 transition-colors pt-0.5 cursor-grab">
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                #{index + 1}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                {field.type}
              </span>
              {field.required && (
                <span className="inline-flex items-center text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  <Asterisk className="w-3 h-3 mr-0.5" /> Required
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 truncate">
              {field.label || 'Untitled Field'}
            </h4>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="font-mono text-slate-500">key: {field.key}</span>
              {field.placeholder && (
                <span className="truncate max-w-[200px]">
                  hint: "{field.placeholder}"
                </span>
              )}
              {field.options && field.options.length > 0 && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Layers className="w-3 h-3" /> {field.options.length} options
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Reordering */}
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Move Up"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === totalFields - 1}
            onClick={onMoveDown}
            title="Move Down"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Edit config */}
          <button
            type="button"
            onClick={onSelect}
            title="Configure Field"
            className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            title="Delete Field"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldCard;
