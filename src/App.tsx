import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ArcReactorOrb } from './components/ArcReactorOrb';
import { VoiceCommandInput } from './components/VoiceCommandInput';
import { AppLaunchpad } from './components/AppLaunchpad';
import { ScriptTerminalLab } from './components/ScriptTerminalLab';
import { ExecutionFeed } from './components/ExecutionFeed';
import { BridgeModal } from './components/BridgeModal';
import { CustomAppModal } from './components/CustomAppModal';
import { InstallModal } from './components/InstallModal';
import { DEFAULT_DESKTOP_APPS } from './data/defaultApps';
import {
  DesktopApp,
  ExecutionLog,
  JarvisCommandResult,
  JarvisStatus,
  OSPlatform,
} from './types/jarvis';
import { jarvisAudio } from './utils/jarvisAudio';
import { checkLocalBridgeHealth, executePcApp } from './utils/appLauncher';
import { Laptop, Cpu, ShieldCheck, Zap, Terminal, Sparkles } from 'lucide-react';

const HUD_BACKDROP = '/src/assets/images/jarvis_hud_backdrop_1790163654050.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'deck' | 'launchpad' | 'scripts' | 'bridge'>('deck');
  const [os, setOs] = useState<OSPlatform>('windows');
  const [apps, setApps] = useState<DesktopApp[]>(DEFAULT_DESKTOP_APPS);
  const [status, setStatus] = useState<JarvisStatus>('standby');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguage] = useState<'auto' | 'en' | 'hi'>('auto');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [voiceText, setVoiceText] = useState<string>('Online and ready for your commands, Sir.');
  const [hindiVoiceText, setHindiVoiceText] = useState<string>('सिस्टम तैयार है, सर। कोई भी ऐप या कमांड बोलिए।');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Auto-detect Operating System
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes('mac')) {
        setOs('mac');
      } else if (userAgent.includes('linux')) {
        setOs('linux');
      } else {
        setOs('windows');
      }
    }

    // Load custom apps from localStorage
    try {
      const saved = localStorage.getItem('jarvis_custom_apps');
      if (saved) {
        const parsed: DesktopApp[] = JSON.parse(saved);
        setApps([...DEFAULT_DESKTOP_APPS, ...parsed]);
      }
    } catch {}

    // Load logs
    try {
      const savedLogs = localStorage.getItem('jarvis_logs');
      if (savedLogs) {
        setExecutionLogs(JSON.parse(savedLogs));
      }
    } catch {}

    // Initial bridge ping check
    checkLocalBridgeHealth().then((res) => {
      setBridgeConnected(res.online);
    });

    // Periodic bridge health check (every 10s)
    const interval = setInterval(() => {
      checkLocalBridgeHealth().then((res) => {
        setBridgeConnected(res.online);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    jarvisAudio.setMuted(nextMute);
    showNotification(nextMute ? 'JARVIS Voice Muted' : 'JARVIS Voice Audio Unmuted', 'info');
  };

  // Add Custom App
  const handleAddCustomApp = (newApp: DesktopApp) => {
    const updated = [...apps, newApp];
    setApps(updated);
    const customOnly = updated.filter((a) => a.isCustom);
    localStorage.setItem('jarvis_custom_apps', JSON.stringify(customOnly));
    showNotification(`Registered custom app: ${newApp.name}`, 'success');
  };

  // Delete Custom App
  const handleDeleteCustomApp = (id: string) => {
    const updated = apps.filter((a) => a.id !== id);
    setApps(updated);
    const customOnly = updated.filter((a) => a.isCustom);
    localStorage.setItem('jarvis_custom_apps', JSON.stringify(customOnly));
  };

  // Execute App or Command
  const handleLaunchApp = async (app: DesktopApp, customCmd?: string) => {
    setStatus('executing');
    jarvisAudio.playLaunchSound();

    const spokenText = `Executing ${app.name}, Sir.`;
    setVoiceText(spokenText);
    jarvisAudio.speak(spokenText);

    const result = await executePcApp(app, os, customCmd);

    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      query: `Launch ${app.name}`,
      targetApp: app.name,
      command: result.command,
      status: result.success ? (result.method === 'bridge' ? 'bridge_dispatched' : 'protocol_launched') : 'failed',
      method: result.method,
      voiceResponse: spokenText,
    };

    const updatedLogs = [newLog, ...executionLogs.slice(0, 30)];
    setExecutionLogs(updatedLogs);
    localStorage.setItem('jarvis_logs', JSON.stringify(updatedLogs));

    showNotification(result.message, 'success');
    setTimeout(() => setStatus('standby'), 1200);
  };

  // Process Natural Language / Voice Command via Gemini server endpoint
  const processCommand = async (query: string) => {
    if (!query.trim()) return;

    setLastCommand(query);
    setStatus('processing');
    jarvisAudio.playActivationSound();

    try {
      const res = await fetch('/api/jarvis/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          os,
          lang: language,
          localBridgeConnected: bridgeConnected,
        }),
      });

      const json = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error || 'Failed to process command');
      }

      const result: JarvisCommandResult = json.data;

      // Update voice text
      setVoiceText(result.voiceResponse);
      if (result.hindiResponse) {
        setHindiVoiceText(result.hindiResponse);
      }

      // Speak response out loud
      setStatus('speaking');
      const responseToSpeak =
        language === 'hi' && result.hindiResponse
          ? result.hindiResponse
          : result.voiceResponse;

      jarvisAudio.speak(responseToSpeak, {
        onEnd: () => setStatus('standby'),
      });

      // Find matching app in registry
      const normalizedQuery = query.toLowerCase();
      const targetLower = result.targetApp.toLowerCase();

      let matchedApp = apps.find(
        (a) =>
          a.name.toLowerCase().includes(targetLower) ||
          targetLower.includes(a.name.toLowerCase()) ||
          a.voiceKeywords.some((kw) => normalizedQuery.includes(kw))
      );

      // If no pre-configured app matches, create synthetic app definition
      if (!matchedApp) {
        matchedApp = {
          id: `cmd-${Date.now()}`,
          name: result.targetApp,
          category: 'Custom',
          description: result.explanation || `Executed via JARVIS: ${result.command}`,
          iconName: 'Terminal',
          uriScheme: result.uriScheme,
          windowsCmd: result.command,
          macCmd: result.command,
          linuxCmd: result.command,
          voiceKeywords: [result.targetApp.toLowerCase()],
          color: '#00F0FF',
        };
      }

      // Execute target app/command
      const launchRes = await executePcApp(matchedApp, os, result.command);

      // Record in logs
      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        query,
        targetApp: result.targetApp,
        command: result.command,
        status: launchRes.success ? (launchRes.method === 'bridge' ? 'bridge_dispatched' : 'protocol_launched') : 'failed',
        method: launchRes.method,
        voiceResponse: result.voiceResponse,
        hindiResponse: result.hindiResponse,
      };

      const updatedLogs = [newLog, ...executionLogs.slice(0, 30)];
      setExecutionLogs(updatedLogs);
      localStorage.setItem('jarvis_logs', JSON.stringify(updatedLogs));

      showNotification(launchRes.message, 'success');
    } catch (error: any) {
      console.error('Command processing error:', error);
      jarvisAudio.playAlertSound();
      setStatus('standby');
      const errReply = 'I encountered an anomaly processing that instruction, Sir.';
      setVoiceText(errReply);
      jarvisAudio.speak(errReply);
      showNotification('Neural core error processing command', 'warn');
    }
  };

  // Speech Recognition Control
  const toggleListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showNotification('Speech Recognition not supported in this browser. Use text input.', 'warn');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setStatus('standby');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition language
      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'en') {
        recognition.lang = 'en-US';
      } else {
        // Auto / Indian English bilingual
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('listening');
        jarvisAudio.playListeningSound();
        showNotification('Acoustic sensors active. Speak now...', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          processCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setStatus('standby');
        if (event.error !== 'no-speech') {
          showNotification(`Microphone event: ${event.error}`, 'warn');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (status === 'listening') {
          setStatus('standby');
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      setIsListening(false);
      setStatus('standby');
    }
  }, [isListening, language, status]);

  const handleClearLogs = () => {
    setExecutionLogs([]);
    localStorage.removeItem('jarvis_logs');
    showNotification('Execution log purged', 'info');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-cyan-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      {/* Background HUD Backdrop Image with measured scrim */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <img
          src={HUD_BACKDROP}
          alt="JARVIS HUD Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/80 to-transparent" />
      </div>

      {/* Sci-Fi Grid Overlay */}
      <div className="fixed inset-0 hud-grid pointer-events-none z-0" />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-lg text-xs font-mono flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : notification.type === 'warn'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'bridge') {
            setIsBridgeModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        os={os}
        onChangeOs={(newOs) => {
          setOs(newOs);
          showNotification(`Target OS switched to ${newOs.toUpperCase()}`, 'info');
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        bridgeConnected={bridgeConnected}
        onOpenBridgeModal={() => setIsBridgeModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main App Body */}
      <main className="relative z-10 pb-16">
        {activeTab === 'deck' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
            {/* System Status Subtitle Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 text-xs font-mono text-cyan-400/80 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>CORE PROTOCOL: v4.2 // STARK ARCHITECTURE</span>
                <span aria-hidden="true">·</span>
                <span>OS: {os.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsBridgeModalOpen(true)}
                  className="hover:text-cyan-200 cursor-pointer flex items-center gap-1"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>
                    BRIDGE: {bridgeConnected ? 'ONLINE (7890)' : 'STANDALONE URI'}
                  </span>
                </button>
              </div>
            </div>

            {/* Central Arc Reactor Interactive Orb */}
            <ArcReactorOrb
              status={status}
              isListening={isListening}
              onToggleListening={toggleListening}
              lastCommand={lastCommand}
              voiceText={voiceText}
              hindiVoiceText={hindiVoiceText}
            />

            {/* Voice & Keyboard Command Input */}
            <div className="mt-4">
              <VoiceCommandInput
                onSubmitCommand={processCommand}
                isListening={isListening}
                onToggleListening={toggleListening}
                isLoading={status === 'processing'}
                language={language}
                onChangeLanguage={setLanguage}
              />
            </div>

            {/* Quick App Launch Matrix Carousel */}
            <div className="mt-12 max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-hud text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Primary PC Applications
                </h3>
                <button
                  onClick={() => setActiveTab('launchpad')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
                >
                  View All Apps ({apps.length}) →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {apps.slice(0, 6).map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app)}
                    className="hud-panel p-3 rounded-xl flex flex-col items-center text-center gap-2 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all cursor-pointer group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white border border-cyan-500/30 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: `${app.color}25`, borderColor: app.color }}
                    >
                      <Terminal className="w-4 h-4 text-cyan-300" />
                    </div>
                    <span className="font-hud text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate w-full">
                      {app.name}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/70 uppercase">
                      Launch
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Command Execution Stream */}
            <ExecutionFeed
              logs={executionLogs}
              onReplayLog={(log) => processCommand(log.query)}
              onClearLogs={handleClearLogs}
            />
          </div>
        )}

        {activeTab === 'launchpad' && (
          <AppLaunchpad
            apps={apps}
            os={os}
            onLaunchApp={handleLaunchApp}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
            onDeleteCustomApp={handleDeleteCustomApp}
          />
        )}

        {activeTab === 'scripts' && (
          <ScriptTerminalLab
            os={os}
            bridgeConnected={bridgeConnected}
            onRunScriptOnBridge={(name, code) => {
              const syntheticApp: DesktopApp = {
                id: `script-${Date.now()}`,
                name,
                category: 'System',
                description: 'Custom automation script',
                iconName: 'Terminal',
                windowsCmd: code,
                macCmd: code,
                linuxCmd: code,
                voiceKeywords: [name.toLowerCase()],
                color: '#10B981',
              };
              handleLaunchApp(syntheticApp, code);
            }}
          />
        )}
      </main>

      {/* Desktop Bridge Setup Modal */}
      <BridgeModal
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        bridgeConnected={bridgeConnected}
        onBridgeStatusChange={setBridgeConnected}
      />

      {/* Register Custom App Modal */}
      <CustomAppModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddApp={handleAddCustomApp}
      />

      {/* PC Installation & Setup Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onOpenBridgeModal={() => {
          setIsInstallModalOpen(false);
          setIsBridgeModalOpen(true);
        }}
      />
    </div>
  );
}
