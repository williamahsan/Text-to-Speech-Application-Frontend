import React, { useState } from 'react';
import { downloadAudioFile, generateFilename } from '../utils/downloadAudio.js';

export default function DownloadButton({ audioUrl, voice, text }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!audioUrl) return;

    setIsDownloading(true);
    const filename = generateFilename(voice, text);
    downloadAudioFile(audioUrl, filename);

    // Brief timeout to indicate action completed
    setTimeout(() => {
      setIsDownloading(false);
    }, 600);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!audioUrl || isDownloading}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed border border-slate-600 rounded-lg text-sm font-medium text-slate-200 shadow transition"
      aria-label="Download Audio File"
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z" />
          </svg>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 fill-current text-indigo-400" viewBox="0 0 20 20">
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          <span>Download Audio</span>
        </>
      )}
    </button>
  );
}