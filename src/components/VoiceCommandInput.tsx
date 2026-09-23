import React, { useState } from 'react';
import { Mic, MicOff, Send, Sparkles, CornerDownLeft, Globe } from 'lucide-react';

interface VoiceCommandInputProps {
  onSubmitCommand: (query: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isLoading: boolean;
  language: 'auto' | 'en' | 'hi';
  onChangeLanguage: (lang: 'auto' | 'en' | 'hi') => void;
}

export const VoiceCommandInput: React.FC<VoiceCommandInputProps> = ({
  onSubmitCommand,
  isListening,
  onToggleListening,
  isLoading,
  language,
  onChangeLanguage,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmitCommand(text.trim());
    setText('');
  };

  const sampleVoiceCommands = [
    'Open VS Code',
    'Notepad kholo',
    'Launch Calculator',
    'Chrome chalao',
    'Open Spotify',
    'Task Manager open karo',
    'Generate script to clean temp files',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Command Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-1 flex items-center bg-[#071325]/90 border border-cyan-500/40 rounded-xl overflow-hidden focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all">
          {/* Mic Button on Left */}
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-3.5 sm:px-4 flex items-center justify-center transition-colors cursor-pointer border-r border-cyan-500/20 ${
              isListening
                ? 'bg-amber-500/30 text-amber-300 animate-pulse'
                : 'text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-200'
            }`}
            title={isListening ? 'Stop listening' : 'Speak command with microphone'}
            aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-amber-400" />
            ) : (
              <Mic className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          {/* Text Input Field */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... Speak your command (English / हिन्दी)...'
                : 'Ask JARVIS: e.g. "Notepad kholo", "Launch VS Code", "Open Spotify"...'
            }
            disabled={isLoading}
            className="w-full px-4 py-3.5 bg-transparent text-sm sm:text-base text-cyan-100 placeholder-cyan-500/50 focus:outline-none font-medium"
          />

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1 pr-2">
            <button
              type="button"
              onClick={() => onChangeLanguage(language === 'auto' ? 'en' : language === 'en' ? 'hi' : 'auto')}
              className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-colors cursor-pointer"
              title="Toggle recognition language: Auto / English / Hindi"
            >
              LANG: {language.toUpperCase()}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-3.5 sm:px-5 flex items-center justify-center font-hud font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer ${
              text.trim() && !isLoading
                ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_#00f0ff]'
                : 'bg-slate-900/80 text-slate-500 cursor-not-allowed'
            }`}
            aria-label="Send command"
          >
            <Send className="w-4 h-4 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Execute</span>
          </button>
        </div>
      </form>

      {/* Suggested Quick Commands */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-cyan-500/70 shrink-0 flex items-center gap-1 font-mono text-[11px]">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          QUICK:
        </span>
        {sampleVoiceCommands.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => onSubmitCommand(cmd)}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-900/70 border border-cyan-500/20 text-cyan-300/80 hover:text-cyan-200 hover:border-cyan-400/60 hover:bg-cyan-950/40 transition-all cursor-pointer font-sans whitespace-nowrap"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
