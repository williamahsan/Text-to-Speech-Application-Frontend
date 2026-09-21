import React from 'react';

export default function ErrorMessage({ message, clearError }) {
  if (!message) return null;

  return (
    <div 
      role="alert" 
      className="p-3.5 bg-red-950/60 border border-red-500/80 rounded-lg text-red-200 text-sm flex items-center justify-between shadow-sm animate-fadeIn"
    >
      <div className="flex items-center gap-2">
        <span className="text-red-400 font-bold">✕</span>
        <span>{message}</span>
      </div>
      {clearError && (
        <button 
          type="button" 
          onClick={clearError}
          className="text-red-300 hover:text-white px-2 py-0.5 rounded transition"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}