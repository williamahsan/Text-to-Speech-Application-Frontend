import React, { useEffect, useMemo } from 'react';
import { LANGUAGES, VOICES } from '../utils/data.js';

export default function ConfigurationSelectors({ language, setLanguage, voice, setVoice }) {
  // Filter voices dynamically based on the active language
  const availableVoices = useMemo(() => {
    return VOICES.filter(v => v.languageCode === language);
  }, [language]);

  // Auto-select the first valid voice when the language changes
  useEffect(() => {
    if (availableVoices.length > 0 && !availableVoices.find(v => v.id === voice)) {
      setVoice(availableVoices[0].id);
    }
  }, [language, availableVoices, voice, setVoice]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-sm focus:border-indigo-500 outline-none"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Voice Style</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-sm focus:border-indigo-500 outline-none"
        >
          {availableVoices.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}