import React, { useState } from 'react';
import { X, Plus, Terminal, Sparkles, Folder } from 'lucide-react';
import { AppCategory, DesktopApp } from '../types/jarvis';

interface CustomAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (app: DesktopApp) => void;
}

export const CustomAppModal: React.FC<CustomAppModalProps> = ({
  isOpen,
  onClose,
  onAddApp,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AppCategory>('Custom');
  const [description, setDescription] = useState('');
  const [windowsCmd, setWindowsCmd] = useState('');
  const [macCmd, setMacCmd] = useState('');
  const [linuxCmd, setLinuxCmd] = useState('');
  const [uriScheme, setUriScheme] = useState('');
  const [keywords, setKeywords] = useState('');
  const [color, setColor] = useState('#00F0FF');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !windowsCmd.trim()) return;

    const newApp: DesktopApp = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || `Custom PC application: ${name}`,
      iconName: 'Terminal',
      uriScheme: uriScheme.trim() || undefined,
      windowsCmd: windowsCmd.trim(),
      macCmd: macCmd.trim() || `open -a '${name}'`,
      linuxCmd: linuxCmd.trim() || name.toLowerCase(),
      voiceKeywords: keywords
        .split(',')
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean),
      isCustom: true,
      color,
    };

    onAddApp(newApp);
    setName('');
    setDescription('');
    setWindowsCmd('');
    setMacCmd('');
    setLinuxCmd('');
    setUriScheme('');
    setKeywords('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl hud-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-hud text-xl font-bold text-white tracking-wide uppercase">
              Register Custom PC App
            </h3>
            <p className="text-xs font-mono text-cyan-400/80">
              EXPAND JARVIS LAUNCH MATRIX
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* App Name */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              Application Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. OBS Studio, Blender, Minecraft, Postman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/70 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AppCategory)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Custom">Custom</option>
              <option value="Development">Development</option>
              <option value="Productivity">Productivity</option>
              <option value="Media">Media</option>
              <option value="Gaming">Gaming</option>
              <option value="System">System</option>
              <option value="Communication">Communication</option>
            </select>
          </div>

          {/* Windows Command / Path */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              Windows Launch Command / Executable Path *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. start obs64.exe or C:\Program Files\Blender\blender.exe"
              value={windowsCmd}
              onChange={(e) => setWindowsCmd(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/70 border border-cyan-500/30 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* macOS Command */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              macOS Launch Command (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. open -a 'Blender'"
              value={macCmd}
              onChange={(e) => setMacCmd(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/70 border border-cyan-500/30 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* URI Scheme */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              Custom URI Protocol Scheme (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. obs:// or steam:// or custom-scheme://"
              value={uriScheme}
              onChange={(e) => setUriScheme(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/70 border border-cyan-500/30 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Voice Keywords */}
          <div>
            <label className="block text-cyan-300 font-semibold mb-1">
              Voice Keywords / Hinglish Triggers (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. obs, stream, record, recording chalao"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-black/70 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-hud font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
