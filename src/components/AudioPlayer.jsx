import React, { useState, useRef, useEffect } from 'react';
import { formatTime } from '../utils/formatTime.js';
import DownloadButton from './DownloadButton.jsx';

export default function AudioPlayer({ audioUrl, voice, text }) {
  const audioRef = useRef(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState('');

  // Reset states whenever a new audio source URL is supplied
  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(false);
      setCurrentTime(0);
      setPlaybackError('');
    }
  }, [audioUrl]);

  if (!audioUrl) return null;

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        setPlaybackError('Playback prevented by browser policies or invalid audio source.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  // Synchronize playback progress
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Load duration when metadata is ready
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Track scrubber / seeking
  const handleSeek = (e) => {
    const seekTarget = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTarget;
      setCurrentTime(seekTarget);
    }
  };

  // Volume and mute controls
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    setPlaybackError('Failed to decode or play the audio stream.');
    setIsPlaying(false);
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-lg space-y-4">
      {/* Hidden native audio element handling media events */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex items-center justify-between border-b border-slate-700 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Audio Preview
        </span>
        <span className="text-xs text-slate-400 font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {playbackError && (
        <div className="p-2 bg-red-950/60 border border-red-500/50 rounded text-red-300 text-xs">
          {playbackError}
        </div>
      )}

      {/* Scrubbing Trackbar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      {/* Controls Container */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-md transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Volume & Mute Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-200 transition"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <DownloadButton audioUrl={audioUrl} voice={voice} text={text} />
      </div>
    </div>
  );
}