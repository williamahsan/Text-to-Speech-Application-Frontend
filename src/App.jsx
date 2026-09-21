import React, { useState } from 'react';
import TextInput from './components/TextInput.jsx';
import ConfigurationSelectors from './components/ConfigurationSelectors.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { validateTextInput, MAX_CHARS } from './utils/validation.js';

export default function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [voice, setVoice] = useState('Joanna');
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async () => {
    const { isValid, error } = validateTextInput(text, MAX_CHARS);

    if (!isValid) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage('');
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, language, voice })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate audio');
      }

      // Sets base64 data URI directly into the player
      setAudioUrl(result.data.audioUrl);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <ErrorMessage message={errorMessage} clearError={() => setErrorMessage('')} />

        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6">
          <TextInput
            text={text}
            setText={setText}
            maxChars={MAX_CHARS}
            clearError={() => setErrorMessage('')}
          />

          <ConfigurationSelectors
            language={language}
            setLanguage={setLanguage}
            voice={voice}
            setVoice={setVoice}
          />

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg shadow transition"
          >
            {isLoading ? (
              <>
                <div className='flex justify-center items-center gap-1'>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z" />
                </svg>
                <span>Synthesizing Speech...</span>
                </div>
              </>
            ) : (
              'Generate Speech'
            )}
          </button>
        </div>

        <AudioPlayer audioUrl={audioUrl} voice={voice} text={text} />
      </div>
    </div>
  );
}