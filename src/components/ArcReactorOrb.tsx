import React from 'react';
import { Mic, MicOff, Cpu, Sparkles, Volume2 } from 'lucide-react';
import { JarvisStatus } from '../types/jarvis';

// Generated authentic Arc Reactor image
const ARC_REACTOR_IMG = '/src/assets/images/jarvis_arc_reactor_1790163640928.jpg';

interface ArcReactorOrbProps {
  status: JarvisStatus;
  isListening: boolean;
  onToggleListening: () => void;
  lastCommand?: string;
  voiceText?: string;
  hindiVoiceText?: string;
}

export const ArcReactorOrb: React.FC<ArcReactorOrbProps> = ({
  status,
  isListening,
  onToggleListening,
  lastCommand,
  voiceText,
  hindiVoiceText,
}) => {
  const getStatusLabel = () => {
    switch (status) {
      case 'listening':
        return 'ACOUSTIC RECEPTORS ACTIVE — LISTENING';
      case 'processing':
        return 'NEURAL QUANTUM PROCESSOR — ANALYZING';
      case 'speaking':
        return 'AUDIO SYNTHESIZER BROADCASTING';
      case 'executing':
        return 'EXECUTING OS DESKTOP INSTRUCTION';
      default:
        return 'SYSTEM READY — AWAITING VOICE COMMAND';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'text-amber-400 border-amber-500/40';
      case 'processing':
        return 'text-cyan-400 border-cyan-500/40';
      case 'speaking':
        return 'text-emerald-400 border-emerald-500/40';
      case 'executing':
        return 'text-blue-400 border-blue-500/40';
      default:
        return 'text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6 sm:py-10">
      {/* Background ambient glow */}
      <div
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full filter blur-3xl transition-opacity duration-700 pointer-events-none ${
          status === 'listening'
            ? 'bg-amber-500/20 opacity-90'
            : status === 'processing'
            ? 'bg-cyan-500/25 opacity-100'
            : status === 'speaking'
            ? 'bg-emerald-500/20 opacity-80'
            : 'bg-cyan-500/15 opacity-60'
        }`}
      />

      {/* Main Interactive Arc Reactor Core */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring 1: High-Tech Compass Markers */}
        <div
          className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-cyan-500/30 transition-transform duration-1000 ${
            status === 'processing' ? 'animate-spin-slow' : 'rotate-45'
          }`}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-t-2 border-cyan-400" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 border-b-2 border-cyan-400" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 border-l-2 border-cyan-400" />
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 border-r-2 border-cyan-400" />
        </div>

        {/* Outer Ring 2: Counter-rotating orbital rings */}
        <div
          className={`absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-cyan-400/20 border-t-cyan-400/80 border-b-cyan-400/80 transition-all ${
            status === 'processing'
              ? 'animate-spin-reverse'
              : status === 'listening'
              ? 'animate-pulse'
              : 'rotate-12'
          }`}
        />

        {/* Central Clickable Arc Reactor Button */}
        <button
          onClick={onToggleListening}
          className="group relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden p-1.5 focus:outline-none cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(0,240,255,0.25)]"
          title={isListening ? 'Click to stop listening' : 'Click to activate JARVIS voice command'}
          aria-label="Toggle voice command"
        >
          {/* Inner core image */}
          <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-cyan-400/60 bg-black/60">
            <img
              src={ARC_REACTOR_IMG}
              alt="JARVIS Arc Reactor Core"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-700 ${
                status === 'processing'
                  ? 'brightness-125 scale-110'
                  : status === 'listening'
                  ? 'brightness-110 saturate-150'
                  : 'brightness-95 group-hover:brightness-110'
              }`}
            />

            {/* Glowing Center Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-transparent to-black/40">
              <div
                className={`p-3.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  isListening
                    ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_20px_#f59e0b]'
                    : status === 'processing'
                    ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_20px_#00f0ff]'
                    : status === 'speaking'
                    ? 'bg-emerald-500/30 border-emerald-400 shadow-[0_0_20px_#10b981]'
                    : 'bg-black/60 border-cyan-500/50 text-cyan-300 group-hover:border-cyan-300 group-hover:shadow-[0_0_15px_#00f0ff]'
                }`}
              >
                {isListening ? (
                  <Mic className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300 animate-pulse" />
                ) : status === 'processing' ? (
                  <Cpu className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-300 animate-spin" />
                ) : status === 'speaking' ? (
                  <Volume2 className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-300 animate-bounce" />
                ) : (
                  <Mic className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-300" />
                )}
              </div>

              {/* Status text badge */}
              <span className="mt-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-cyan-200 bg-black/70 px-2.5 py-0.5 rounded border border-cyan-500/30">
                {isListening ? 'RECORDING' : status === 'processing' ? 'THINKING' : status === 'speaking' ? 'SPEAKING' : 'TAP TO TALK'}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Real-time Visualizer bars when Speaking or Listening */}
      <div className="mt-6 flex items-center justify-center gap-1.5 h-6">
        {[40, 65, 90, 45, 80, 100, 70, 35, 85, 60, 95, 50, 75, 40].map((height, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              isListening
                ? 'bg-amber-400'
                : status === 'speaking'
                ? 'bg-emerald-400'
                : status === 'processing'
                ? 'bg-cyan-400'
                : 'bg-cyan-500/30'
            }`}
            style={{
              height:
                isListening || status === 'speaking'
                  ? `${Math.max(6, Math.min(24, (height * (status === 'speaking' ? 0.9 : 0.7)) + Math.sin(Date.now() / 150 + i) * 6))}px`
                  : '4px',
            }}
          />
        ))}
      </div>

      {/* Telemetry Status Line */}
      <div className="mt-3 flex items-center gap-2 text-xs font-mono">
        <span className={`px-2.5 py-0.5 rounded border ${getStatusColor()} bg-slate-950/60`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Voice Response Dialogue Display */}
      {(voiceText || lastCommand) && (
        <div className="mt-4 max-w-xl mx-auto px-4 text-center">
          {lastCommand && (
            <p className="text-xs font-mono text-cyan-400/80 mb-1">
              INPUT: <span className="text-white font-medium">"{lastCommand}"</span>
            </p>
          )}
          {voiceText && (
            <div className="hud-panel p-3 rounded-lg border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
              <p className="text-sm sm:text-base font-hud text-cyan-200 font-semibold tracking-wide">
                JARVIS: "{voiceText}"
              </p>
              {hindiVoiceText && hindiVoiceText !== voiceText && (
                <p className="text-xs text-amber-300/90 font-medium mt-1">
                  जार्विस: "{hindiVoiceText}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
