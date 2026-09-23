import React from 'react';
import { Volume2, VolumeX, ShieldCheck, ShieldAlert, Laptop, Terminal } from 'lucide-react';
import { OSPlatform } from '../types/jarvis';

interface HeaderProps {
  activeTab: 'deck' | 'launchpad' | 'scripts' | 'bridge';
  onSelectTab: (tab: 'deck' | 'launchpad' | 'scripts' | 'bridge') => void;
  os: OSPlatform;
  onChangeOs: (os: OSPlatform) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  bridgeConnected: boolean;
  onOpenBridgeModal: () => void;
  onOpenInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  os,
  onChangeOs,
  isMuted,
  onToggleMute,
  bridgeConnected,
  onOpenBridgeModal,
  onOpenInstallModal,
}) => {
  return (
    <header className="border-b border-cyan-500/20 bg-[#060c18]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('deck')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-hud text-xl sm:text-2xl font-bold tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]" />
              J.A.R.V.I.S.
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('deck')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              activeTab === 'deck'
                ? 'text-cyan-300 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-cyan-200 border-transparent'
            }`}
          >
            Command Deck
          </button>
          <button
            onClick={() => onSelectTab('launchpad')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              activeTab === 'launchpad'
                ? 'text-cyan-300 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-cyan-200 border-transparent'
            }`}
          >
            PC App Launchpad
          </button>
          <button
            onClick={() => onSelectTab('scripts')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              activeTab === 'scripts'
                ? 'text-cyan-300 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-cyan-200 border-transparent'
            }`}
          >
            Script Generator
          </button>
          <button
            onClick={() => onSelectTab('bridge')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'bridge'
                ? 'text-cyan-300 border-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-cyan-200 border-transparent'
            }`}
          >
            Local Bridge
            {bridgeConnected ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2.5">
          {/* OS Selector */}
          <div className="flex items-center rounded-lg bg-slate-900/80 border border-cyan-500/30 p-0.5 text-xs">
            <button
              onClick={() => onChangeOs('windows')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                os === 'windows'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Target OS: Windows"
            >
              WIN
            </button>
            <button
              onClick={() => onChangeOs('mac')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                os === 'mac'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Target OS: macOS"
            >
              MAC
            </button>
            <button
              onClick={() => onChangeOs('linux')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                os === 'linux'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Target OS: Linux"
            >
              LINUX
            </button>
          </div>

          {/* Bridge Status Trigger */}
          <button
            onClick={onOpenBridgeModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              bridgeConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-300 hover:bg-amber-900/30'
            }`}
          >
            {bridgeConnected ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate">BRIDGE: NATIVE (7890)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">CONNECT PC BRIDGE</span>
              </>
            )}
          </button>

          {/* PC Install Guide Trigger */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-hud font-bold tracking-wider uppercase border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-500/20 hover:border-cyan-400 text-cyan-300 transition-colors cursor-pointer"
              title="How to install & run on your PC"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">PC Setup</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute JARVIS Audio' : 'Mute JARVIS Audio'}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex items-center justify-around border-t border-cyan-500/10 px-2 py-2 text-xs bg-slate-950/60">
        <button
          onClick={() => onSelectTab('deck')}
          className={`cursor-pointer ${activeTab === 'deck' ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Deck
        </button>
        <button
          onClick={() => onSelectTab('launchpad')}
          className={`cursor-pointer ${activeTab === 'launchpad' ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Launchpad
        </button>
        <button
          onClick={() => onSelectTab('scripts')}
          className={`cursor-pointer ${activeTab === 'scripts' ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Scripts
        </button>
        <button
          onClick={() => onSelectTab('bridge')}
          className={`cursor-pointer ${activeTab === 'bridge' ? 'text-cyan-300 font-semibold' : 'text-slate-400'}`}
        >
          Bridge
        </button>
      </div>
    </header>
  );
};
