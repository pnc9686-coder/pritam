import React from 'react';
import { Play, CheckCircle2, Clock, Terminal, Laptop, ExternalLink, Trash2 } from 'lucide-react';
import { ExecutionLog } from '../types/jarvis';

interface ExecutionFeedProps {
  logs: ExecutionLog[];
  onReplayLog: (log: ExecutionLog) => void;
  onClearLogs: () => void;
}

export const ExecutionFeed: React.FC<ExecutionFeedProps> = ({
  logs,
  onReplayLog,
  onClearLogs,
}) => {
  if (logs.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 mt-8">
        <div className="hud-panel rounded-xl p-6 text-center border border-cyan-500/20">
          <Clock className="w-8 h-8 text-cyan-400/50 mx-auto mb-2 animate-pulse" />
          <p className="font-hud text-sm text-cyan-300 font-semibold uppercase tracking-wider">
            Command Telemetry Stream Idle
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Voice commands and app executions will appear in this real-time log. Try saying "Open Notepad" or "Calculator kholo"!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="hud-panel rounded-xl p-5 border border-cyan-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-hud text-sm font-bold text-white uppercase tracking-wider">
              JARVIS Neural Execution Stream ({logs.length})
            </h3>
          </div>

          <button
            onClick={onClearLogs}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>

        <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-black/60 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-cyan-500/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-hud font-bold text-cyan-300 text-sm">
                    {log.targetApp}
                  </span>
                  {/* Anti-pill metadata rule */}
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {log.timestamp}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span
                    className={`font-mono text-[11px] font-medium ${
                      log.method === 'bridge'
                        ? 'text-emerald-400'
                        : log.method === 'uri_protocol'
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {log.method === 'bridge'
                      ? 'NATIVE BRIDGE'
                      : log.method === 'uri_protocol'
                      ? 'URI PROTOCOL'
                      : 'SCRIPT RUNNER'}
                  </span>
                </div>

                <p className="font-mono text-[11px] text-slate-400 truncate">
                  CMD: <span className="text-emerald-400">{log.command}</span>
                </p>

                {log.voiceResponse && (
                  <p className="text-[11px] text-cyan-200/80 italic">
                    "{log.voiceResponse}"
                  </p>
                )}
              </div>

              {/* Replay action */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => onReplayLog(log)}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-[11px] font-bold tracking-wider uppercase border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Re-run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
