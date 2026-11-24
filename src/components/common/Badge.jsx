import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const normalized = String(variant).toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'published' || normalized === 'success') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normalized === 'draft' || normalized === 'warning') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (normalized === 'archived' || normalized === 'danger') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (normalized === 'info' || normalized === 'brand') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles} ${className}`}
    >
      {children || variant}
    </span>
  );
};

export default Badge;
