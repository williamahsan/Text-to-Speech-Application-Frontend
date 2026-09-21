import React from 'react';
import { MAX_CHARS, getMetrics } from '../utils/validation.js';

export default function TextInput({ text, setText, maxChars = MAX_CHARS, clearError }) {
  const { wordCount, charCount } = getMetrics(text);
  const isNearLimit = charCount >= maxChars * 0.9;
  const isAtLimit = charCount >= maxChars;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setText(value);
      if (clearError) clearError();
    }
  };

  const handleClear = () => {
    setText('');
    if (clearError) clearError();
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="tts-input" className="block text-sm font-medium text-slate-300">
          Enter text to convert
        </label>
        {text && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition"
          >
            Clear text
          </button>
        )}
      </div>

      <textarea
        id="tts-input"
        rows={5}
        value={text}
        onChange={handleChange}
        placeholder="Paste or enter text here..."
        className={`w-full bg-slate-900 border rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none ${
          isAtLimit 
            ? 'border-amber-500 focus:border-amber-500' 
            : 'border-slate-700 focus:border-indigo-500'
        }`}
      />

      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span className={isNearLimit ? 'text-amber-400 font-medium' : ''}>
          {charCount} / {maxChars} characters
        </span>
      </div>
    </div>
  );
}