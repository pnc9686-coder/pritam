import React, { useState } from 'react';
import {
  X,
  Laptop,
  Terminal,
  Download,
  Copy,
  Check,
  Cpu,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBridgeModal: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onOpenBridgeModal,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl hud-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-cyan-500/20">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-hud text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
              PC Installation & Setup Guide
            </h3>
            <p className="text-xs font-mono text-cyan-400/80">
              JARVIS KO APNE COMPUTER ME CHALANE KE TARIQE (3 SIMPLE METHODS)
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          {/* Method 1: Instant Bridge (Recommended & Easiest) */}
          <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-hud text-lg font-bold text-cyan-300 tracking-wide uppercase">
                  Sabse Aasan Tarika: Desktop Bridge (1-Minute Setup)
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                RECOMMENDED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Aapko poora code download karne ki zaroorat nahi hai. Is web app ko khula rakhiye aur apne PC par ek chhota bridge script run kijiye. Isse JARVIS seedhe aapke PC ke saare apps control karega:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="/api/jarvis/bridge-script?type=node"
                download="jarvis-bridge.js"
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-xs font-bold uppercase tracking-wider border border-cyan-500/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>1. Download jarvis-bridge.js</span>
              </a>

              <a
                href="/api/jarvis/bridge-script?type=python"
                download="jarvis_bridge.py"
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-xs font-bold uppercase tracking-wider border border-cyan-500/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download jarvis_bridge.py</span>
              </a>
            </div>

            <div className="mt-2 p-3 rounded-lg bg-black/70 border border-cyan-500/20">
              <p className="text-[11px] text-slate-400 mb-1">
                2. Apne Command Prompt / Terminal me jaakar run karein:
              </p>
              <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
                <code>node jarvis-bridge.js</code>
                <button
                  onClick={() => copyCode('node jarvis-bridge.js', 1)}
                  className="text-slate-400 hover:text-cyan-300 p-1 cursor-pointer"
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Method 2: Install as Standalone Desktop App (PWA) */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                2
              </span>
              <h4 className="font-hud text-lg font-bold text-white tracking-wide uppercase">
                Desktop App Shortcut (Google Chrome / Edge)
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Aap is app ko Chrome ya Edge browser se seedhe apne PC me ek <strong>Desktop App</strong> ke roop me install kar sakte hain:
            </p>

            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Apne browser ke Address Bar ke daayein (right) taraf <strong>"Install" (कंप्यूटर आइकन)</strong> par click karein.</li>
              <li>Ya Chrome menu (3 dots) &gt; <strong>"Save and share"</strong> &gt; <strong>"Install JARVIS PC Core"</strong> chunein.</li>
              <li>Aapke desktop aur start menu par JARVIS ka icon ban jayega!</li>
            </ul>
          </div>

          {/* Method 3: Full Local Source Code Setup */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                3
              </span>
              <h4 className="font-hud text-lg font-bold text-white tracking-wide uppercase">
                Poora Project Apne PC Par Run Karna (Source Code)
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Agar aap developer hain aur poora frontend + backend apne local system par run karna chahte hain:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-black/70 border border-cyan-500/20">
                <span className="text-[11px] text-slate-400 block mb-1">Step 1: Dependencies install karein</span>
                <div className="flex items-center justify-between font-mono text-xs text-cyan-300">
                  <code>npm install</code>
                  <button
                    onClick={() => copyCode('npm install', 2)}
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/70 border border-cyan-500/20">
                <span className="text-[11px] text-slate-400 block mb-1">Step 2: .env file me Gemini API Key dalein</span>
                <div className="flex items-center justify-between font-mono text-xs text-cyan-300">
                  <code>GEMINI_API_KEY="AIzaSyYourKeyHere..."</code>
                  <button
                    onClick={() => copyCode('GEMINI_API_KEY=""', 3)}
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/70 border border-cyan-500/20">
                <span className="text-[11px] text-slate-400 block mb-1">Step 3: App start karein</span>
                <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
                  <code>npm run dev</code>
                  <button
                    onClick={() => copyCode('npm run dev', 4)}
                    className="text-slate-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedIndex === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-cyan-300/80 pt-1">
              Browser me <code>http://localhost:3000</code> kholein.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onOpenBridgeModal}
            className="text-xs text-cyan-300 hover:text-cyan-200 underline cursor-pointer flex items-center gap-1"
          >
            <span>Open Bridge Diagnostics & Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
