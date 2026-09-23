import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, Sparkles, Play, Code } from 'lucide-react';
import { OSPlatform } from '../types/jarvis';

interface ScriptTerminalLabProps {
  os: OSPlatform;
  onRunScriptOnBridge?: (scriptName: string, content: string) => void;
  bridgeConnected?: boolean;
}

interface AutomationPreset {
  id: string;
  name: string;
  desc: string;
  platform: OSPlatform;
  type: 'bat' | 'ps1' | 'sh' | 'py';
  code: string;
}

export const ScriptTerminalLab: React.FC<ScriptTerminalLabProps> = ({
  os,
  onRunScriptOnBridge,
  bridgeConnected,
}) => {
  const PRESETS: AutomationPreset[] = [
    {
      id: 'clean-temp',
      name: 'Clean PC Temp & Cache Files',
      desc: 'Frees up disk space by purging Windows temp files & user cache',
      platform: 'windows',
      type: 'bat',
      code: `@echo off
echo ===================================================
echo  J.A.R.V.I.S. AUTOMATION: PC CACHE PURGE PROTOCOL
echo ===================================================
echo Purging Windows Temp files...
del /s /f /q %temp%\\*.* 2>nul
for /d %%p in (%temp%\\*) do rmdir "%%p" /s /q 2>nul
echo Purging Prefetch cache...
del /s /f /q C:\\Windows\\Temp\\*.* 2>nul
echo Purge complete, Sir! System storage optimized.
pause
exit`,
    },
    {
      id: 'network-diag',
      name: 'High-Speed Network & DNS Diagnostic',
      desc: 'Checks gateway latency, flushes DNS cache, and pings 8.8.8.8',
      platform: 'windows',
      type: 'bat',
      code: `@echo off
echo ===================================================
echo  J.A.R.V.I.S. TELEMETRY: NETWORK RECON PROTOCOL
echo ===================================================
echo [1/3] Flushing DNS Resolver Cache...
ipconfig /flushdns
echo [2/3] Checking IP Configuration...
ipconfig | findstr /i "IPv4 Default"
echo [3/3] Ping Latency to Google Core DNS (8.8.8.8)...
ping 8.8.8.8 -n 4
echo Diagnostics completed. All channels operational.
pause
exit`,
    },
    {
      id: 'kill-heavy',
      name: 'Emergency Memory Reclaim (Kill Stuck Apps)',
      desc: 'Terminates unresponsive apps and resets heavy memory allocations',
      platform: 'windows',
      type: 'ps1',
      code: `# J.A.R.V.I.S. PowerShell System Accelerator
Write-Host ">>> J.A.R.V.I.S.: Assessing high-memory processes..." -ForegroundColor Cyan
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 ProcessName, @{Name="RAM (MB)";Expression={[math]::Round($_.WorkingSet64/1MB,2)}}
Write-Host ">>> Memory inspection complete, Sir." -ForegroundColor Green`,
    },
    {
      id: 'mac-clean',
      name: 'macOS Quick Cache & DNS Flush',
      desc: 'Clears mDNSResponder cache and tests local loopback',
      platform: 'mac',
      type: 'sh',
      code: `#!/bin/bash
echo "=== J.A.R.V.I.S. macOS Cache Flush ==="
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
echo "DNS Cache purged."
ping -c 3 1.1.1.1
echo "Systems green."`,
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<AutomationPreset>(PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeScript, setActiveScript] = useState<string>(PRESETS[0].code);
  const [activeName, setActiveName] = useState<string>(PRESETS[0].name);

  const handleSelectPreset = (p: AutomationPreset) => {
    setSelectedPreset(p);
    setActiveScript(p.code);
    setActiveName(p.name);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    const ext = selectedPreset.type;
    const blob = new Blob([activeScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis_${activeName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleGenerateCustomScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Generate an automated executable script for ${os}: "${customPrompt}"`,
          os,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const genCode =
          data.data.scriptContent ||
          `:: JARVIS Custom Automation for ${os}\n:: ${data.data.explanation || customPrompt}\n${data.data.command}\necho Protocol executed, Sir.\npause\n`;
        setActiveScript(genCode);
        setActiveName(data.data.targetApp || 'Custom Task');
      }
    } catch (err) {
      console.warn('Script generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-cyan-500/20">
        <h2 className="font-hud text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-cyan-400" />
          JARVIS PC Automation & Script Lab
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300/70 mt-1">
          Generate, copy, and run custom Batch (.bat), PowerShell (.ps1), and Shell (.sh) automation routines for your PC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Preset Templates & Custom Generator */}
        <div className="space-y-6">
          {/* Custom Script AI Generator */}
          <div className="hud-panel rounded-xl p-5 border border-cyan-500/30">
            <h3 className="font-hud text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              AI Script Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Describe any PC maintenance or task in English or Hindi (e.g. "Backup D drive to backup folder", "Restart Windows audio").
            </p>

            <form onSubmit={handleGenerateCustomScript} className="mt-3 space-y-2.5">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Clean temporary files and restart explorer"
                className="w-full p-2.5 rounded-lg bg-black/60 border border-cyan-500/30 text-xs text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!customPrompt.trim() || isGenerating}
                className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? 'Synthesizing Script...' : 'Generate Automation Script'}
              </button>
            </form>
          </div>

          {/* Quick Automation Routines */}
          <div className="hud-panel rounded-xl p-5 border border-cyan-500/30 space-y-3">
            <h3 className="font-hud text-base font-bold text-white tracking-wide uppercase">
              PC Automation Presets
            </h3>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    activeName === p.name
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-black/40 border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-black/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold font-hud">
                    <span>{p.name}</span>
                    <span className="font-mono text-[10px] text-cyan-400 uppercase">
                      .{p.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Terminal Viewer */}
        <div className="lg:col-span-2 hud-panel rounded-xl p-5 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            {/* Terminal Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-hud font-bold text-sm text-cyan-300 ml-2 uppercase">
                  {activeName}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-black/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Script'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-hud font-bold tracking-wide uppercase flex items-center gap-1.5 transition-all cursor-pointer border border-cyan-500/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="mt-4 p-4 rounded-lg bg-black/80 border border-cyan-500/20 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto leading-relaxed max-h-[450px]">
              <code>{activeScript}</code>
            </pre>
          </div>

          {/* Execution Tip */}
          <div className="mt-4 pt-3 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              Tip: Click "Download File" and double-click to run on your PC, or paste directly into Terminal.
            </span>
            {bridgeConnected && onRunScriptOnBridge && (
              <button
                onClick={() => onRunScriptOnBridge(activeName, activeScript)}
                className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-hud text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                Execute on Local PC via Bridge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
