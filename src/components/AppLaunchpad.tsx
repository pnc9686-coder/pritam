import React, { useState } from 'react';
import {
  Code2,
  Globe,
  FileText,
  Calculator,
  Music,
  FolderClosed,
  Terminal,
  Activity,
  Settings,
  MessageSquare,
  Gamepad2,
  Palette,
  Film,
  PhoneCall,
  Play,
  Copy,
  Download,
  Plus,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { DesktopApp, OSPlatform } from '../types/jarvis';
import { downloadQuickLauncher } from '../utils/appLauncher';

interface AppLaunchpadProps {
  apps: DesktopApp[];
  os: OSPlatform;
  onLaunchApp: (app: DesktopApp) => void;
  onOpenCustomModal: () => void;
  onDeleteCustomApp?: (id: string) => void;
  activeFilter?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  FolderClosed: <FolderClosed className="w-5 h-5" />,
  Terminal: <Terminal className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Film: <Film className="w-5 h-5" />,
  PhoneCall: <PhoneCall className="w-5 h-5" />,
};

export const AppLaunchpad: React.FC<AppLaunchpadProps> = ({
  apps,
  os,
  onLaunchApp,
  onOpenCustomModal,
  onDeleteCustomApp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Development', 'Productivity', 'System', 'Media', 'Communication', 'Gaming', 'Custom'];

  const filteredApps = apps.filter((app) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Custom') return app.isCustom;
    return app.category === selectedCategory;
  });

  const handleCopyCommand = async (app: DesktopApp, e: React.MouseEvent) => {
    e.stopPropagation();
    const cmd = os === 'windows' ? app.windowsCmd : os === 'mac' ? app.macCmd : app.linuxCmd;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedId(app.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleDownloadLauncher = (app: DesktopApp, e: React.MouseEvent) => {
    e.stopPropagation();
    const cmd = os === 'windows' ? app.windowsCmd : os === 'mac' ? app.macCmd : app.linuxCmd;
    downloadQuickLauncher(app.name, cmd, os);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Launchpad Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
        <div>
          <h2 className="font-hud text-2xl sm:text-3xl font-bold tracking-wide text-white uppercase flex items-center gap-2.5">
            <span className="w-2 h-6 bg-cyan-400 inline-block rounded-sm" />
            PC Application Command Matrix
          </h2>
          <p className="text-xs sm:text-sm text-cyan-300/70 mt-1">
            Directly trigger or voice-launch installed desktop apps for {os.toUpperCase()}.
          </p>
        </div>

        {/* Add Custom PC App Button */}
        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 font-hud text-sm font-semibold tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        >
          <Plus className="w-4 h-4" />
          <span>Register PC App</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-[0_0_12px_#00f0ff]'
                : 'bg-slate-900/80 text-slate-400 hover:text-cyan-200 border border-cyan-500/20 hover:border-cyan-500/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
        {filteredApps.map((app) => {
          const currentCmd = os === 'windows' ? app.windowsCmd : os === 'mac' ? app.macCmd : app.linuxCmd;
          return (
            <div
              key={app.id}
              className="hud-panel rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group relative overflow-hidden"
            >
              {/* Top Row: Icon & Meta */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white border border-cyan-500/30"
                    style={{ backgroundColor: `${app.color}25`, borderColor: app.color }}
                  >
                    {ICON_MAP[app.iconName] || <Terminal className="w-5 h-5 text-cyan-300" />}
                  </div>

                  {/* Clean unboxed category & protocol indicator (anti-pill compliant) */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/80">
                    <span>{app.category}</span>
                    {app.uriScheme && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400">URI</span>
                      </>
                    )}
                  </div>
                </div>

                {/* App Name & Description */}
                <h3 className="font-hud text-lg font-bold text-white tracking-wide mt-3 group-hover:text-cyan-300 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {app.description}
                </p>

                {/* OS Command Preview */}
                <div className="mt-3 p-2 rounded bg-black/50 border border-cyan-500/20 font-mono text-[11px] text-cyan-300/90 truncate flex items-center justify-between">
                  <span className="truncate">{currentCmd}</span>
                  <button
                    onClick={(e) => handleCopyCommand(app, e)}
                    className="ml-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
                    title="Copy shell command"
                  >
                    {copiedId === app.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between gap-2">
                <button
                  onClick={() => onLaunchApp(app)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-hud text-xs font-bold tracking-wider uppercase border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Now</span>
                </button>

                <button
                  onClick={(e) => handleDownloadLauncher(app, e)}
                  className="p-2 rounded-lg bg-slate-900 border border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-colors cursor-pointer"
                  title={`Download .${os === 'windows' ? 'bat' : 'sh'} 1-click launcher`}
                >
                  <Download className="w-4 h-4" />
                </button>

                {app.isCustom && onDeleteCustomApp && (
                  <button
                    onClick={() => onDeleteCustomApp(app.id)}
                    className="text-[11px] text-rose-400/80 hover:text-rose-300 underline cursor-pointer px-1"
                    title="Remove custom app"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="hud-panel rounded-xl p-12 text-center mt-6">
          <p className="text-slate-400 text-sm">No applications found in this category.</p>
          <button
            onClick={onOpenCustomModal}
            className="mt-4 px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-hud font-bold text-xs cursor-pointer"
          >
            Add New App
          </button>
        </div>
      )}
    </div>
  );
};
