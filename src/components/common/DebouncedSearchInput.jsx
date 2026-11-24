import React, { useState, useEffect, useRef, memo } from 'react';
import { Search, X } from 'lucide-react';

/**
 * High-performance, debounced search input component.
 * Encapsulates internal typing state to completely isolate 60fps keystroke renders
 * from propagating to parent lists, metric cards, or global Redux store.
 */
const DebouncedSearchInput = memo(({
  value: initialValue = '',
  onChange,
  placeholder = 'Search...',
  delay = 350,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const isFirstMount = useRef(true);

  // Sync internal state if prop changes externally
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Debounce notification to parent
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 outline-none transition-all bg-white"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

DebouncedSearchInput.displayName = 'DebouncedSearchInput';

export default DebouncedSearchInput;
