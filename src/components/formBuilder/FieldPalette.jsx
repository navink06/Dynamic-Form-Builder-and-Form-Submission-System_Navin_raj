import React from 'react';
import {
  Type,
  Mail,
  Hash,
  Phone,
  AlignLeft,
  Calendar,
  ListFilter,
  CheckCircle2,
  CheckSquare,
  Plus
} from 'lucide-react';

const FIELD_TYPES_CONFIG = [
  {
    type: 'TEXT',
    label: 'Single-line Text',
    description: 'Names, addresses, short inputs',
    icon: Type,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    type: 'EMAIL',
    label: 'Email Address',
    description: 'Validated RFC email format',
    icon: Mail,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    type: 'NUMBER',
    label: 'Numeric Value',
    description: 'Integers, floats, ranges',
    icon: Hash,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    type: 'PHONE',
    label: 'Phone Number',
    description: 'International & local numbers',
    icon: Phone,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  {
    type: 'TEXTAREA',
    label: 'Long Text Area',
    description: 'Multi-line descriptions & notes',
    icon: AlignLeft,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    type: 'DATE',
    label: 'Date Picker',
    description: 'Calendar date selection',
    icon: Calendar,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    type: 'SELECT',
    label: 'Dropdown Select',
    description: 'Single choice from dropdown list',
    icon: ListFilter,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    type: 'RADIO',
    label: 'Radio Options',
    description: 'Single choice radio buttons',
    icon: CheckCircle2,
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200'
  },
  {
    type: 'CHECKBOX',
    label: 'Checkbox Group',
    description: 'Multiple selectable options',
    icon: CheckSquare,
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  }
];

const FieldPalette = ({ onAddField }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Form Elements</h3>
        <p className="text-xs text-slate-500">Click any field to add it to your form canvas</p>
      </div>

      <div className="space-y-2">
        {FIELD_TYPES_CONFIG.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onAddField(item.type, item.label)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-brand-500 hover:bg-brand-50/40 text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-brand-100 group-hover:text-brand-600 flex items-center justify-center text-slate-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight">
                    {item.description}
                  </div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-brand-600">
                <Plus className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FieldPalette;
