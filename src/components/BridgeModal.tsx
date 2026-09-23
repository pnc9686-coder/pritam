import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Download,
  Copy,
  Check,
  RefreshCw,
  X,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { checkLocalBridgeHealth } from '../utils/appLauncher';

interface BridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bridgeConnected: boolean;
  onBridgeStatusChange: (status: boolean) => void;
}

export const BridgeModal: React.FC<BridgeModalProps> = ({
  isOpen,
  onClose,
  bridgeConnected,
  onBridgeStatusChange,
}) => {
  const [checking, setChecking] = useState(false);
  const [copiedNode, setCopiedNode] = useState(false);
  const [copiedPy, setCopiedPy] = useState(false);
  const [bridgeDetails, setBridgeDetails] = useState<any>(null);

  const testConnection = async () => {
    setChecking(true);
    const res = await checkLocalBridgeHealth();
    setChecking(false);
    onBridgeStatusChange(res.online);
    if (res.online && res.details) {
      setBridgeDetails(res.details);
    }
  };

  useEffect(() => {
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const downloadScript = (type: 'node' | 'python') => {
    window.open(`/api/jarvis/bridge-script?type=${type}`, '_blank');
  };

  const copyToClipboard = async (text: string, type: 'node' | 'py') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'node') {
        setCopiedNode(true);
        setTimeout(() => setCopiedNode(false), 2000);
      } else {
        setCopiedPy(true);
        setTimeout(() => setCopiedPy(false), 2000);
      }
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl hud-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-hud text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
              JARVIS PC Desktop Bridge
            </h3>
            <p className="text-xs font-mono text-cyan-400/80">
              LOCAL HOST EXECUTION PROTOCOL (PORT 7890)
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`mt-6 p-4 rounded-xl border flex items-center justify-between gap-3 ${
            bridgeConnected
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {bridgeConnected ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {bridgeConnected
                  ? 'PC Bridge Connected & Active!'
                  : 'Desktop Bridge Currently Offline'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {bridgeConnected
                  ? `Running on ${bridgeDetails?.os || 'Local PC'} (${bridgeDetails?.hostname || 'localhost'}). Voice commands execute natively!`
                  : 'Follow the 2 simple steps below to run PC apps directly from voice!'}
              </p>
            </div>
          </div>

          <button
            onClick={testConnection}
            disabled={checking}
            className="px-3 py-1.5 rounded-lg bg-black/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Testing...' : 'Check Ping'}</span>
          </button>
        </div>

        {/* Why Bridge is Needed (Hindi & English) */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
          <p className="text-cyan-300 font-semibold">
            How it works / यह कैसे काम करता है:
          </p>
          <p>
            Web browsers sandbox apps for security. The JARVIS Bridge is a tiny, zero-dependency background script that runs on your computer. When you speak "Notepad kholo" or "Launch Spotify", JARVIS signals this bridge to instantly start the real app on your PC!
          </p>
          <p className="text-amber-200/90 font-medium">
            (अगर ब्रिज कनेक्ट नहीं है, तब भी JARVIS Browser Protocols और 1-Click Runner Scripts के ज़रिये ऐप्स ओपन कर सकता है!)
          </p>
        </div>

        {/* Steps to activate */}
        <div className="mt-6 space-y-4">
          <h4 className="font-hud text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Quick Setup (Option 1: Node.js)
          </h4>

          <div className="p-4 rounded-xl bg-black/70 border border-cyan-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-cyan-300 font-medium">1. Download lightweight script:</span>
              <button
                onClick={() => downloadScript('node')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-xs font-bold transition-all cursor-pointer border border-cyan-500/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download jarvis-bridge.js</span>
              </button>
            </div>

            <div>
              <span className="text-xs text-cyan-300 font-medium">2. Open terminal in folder and run:</span>
              <div className="mt-1.5 p-2.5 rounded-lg bg-slate-950 border border-cyan-500/20 font-mono text-xs text-emerald-400 flex items-center justify-between">
                <code>node jarvis-bridge.js</code>
                <button
                  onClick={() => copyToClipboard('node jarvis-bridge.js', 'node')}
                  className="text-slate-400 hover:text-cyan-300 cursor-pointer p-1"
                  title="Copy command"
                >
                  {copiedNode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <h4 className="font-hud text-base font-bold text-white tracking-wide uppercase flex items-center gap-2 pt-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Alternative Setup (Option 2: Python 3)
          </h4>

          <div className="p-4 rounded-xl bg-black/70 border border-cyan-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-cyan-300 font-medium">1. Download Python daemon:</span>
              <button
                onClick={() => downloadScript('python')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-xs font-bold transition-all cursor-pointer border border-cyan-500/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download jarvis_bridge.py</span>
              </button>
            </div>

            <div>
              <span className="text-xs text-cyan-300 font-medium">2. Run in terminal (No pip install needed):</span>
              <div className="mt-1.5 p-2.5 rounded-lg bg-slate-950 border border-cyan-500/20 font-mono text-xs text-emerald-400 flex items-center justify-between">
                <code>python jarvis_bridge.py</code>
                <button
                  onClick={() => copyToClipboard('python jarvis_bridge.py', 'py')}
                  className="text-slate-400 hover:text-cyan-300 cursor-pointer p-1"
                  title="Copy command"
                >
                  {copiedPy ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer"
          >
            Ready & Return
          </button>
        </div>
      </div>
    </div>
  );
};
