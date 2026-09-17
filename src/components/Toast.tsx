import React from 'react';
import { Check, X, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-5 sm:max-w-md z-50 flex items-center justify-between gap-2.5 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150 border border-slate-700">
      <div className="flex items-center gap-2.5 min-w-0">
        {type === 'success' ? (
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        )}
        <span className="truncate">{message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
