import { DesktopApp, OSPlatform } from '../types/jarvis';

const LOCAL_BRIDGE_URL = 'http://localhost:7890';

export interface LaunchResult {
  success: boolean;
  method: 'bridge' | 'uri_protocol' | 'download_script' | 'web_open';
  message: string;
  command: string;
}

/**
 * Checks if the user's local PC bridge daemon (node or python) is running on localhost:7890
 */
export async function checkLocalBridgeHealth(): Promise<{ online: boolean; details?: any }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${LOCAL_BRIDGE_URL}/status`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, details: data };
    }
  } catch {
    // Bridge offline or not started
  }
  return { online: false };
}

/**
 * Executes a PC app or command via the best available method
 */
export async function executePcApp(
  app: DesktopApp,
  os: OSPlatform,
  customCmd?: string
): Promise<LaunchResult> {
  const targetCmd = customCmd || (os === 'windows' ? app.windowsCmd : os === 'mac' ? app.macCmd : app.linuxCmd);

  // 1. Try Local Native Desktop Bridge first (Full native PC power!)
  const bridgeStatus = await checkLocalBridgeHealth();
  if (bridgeStatus.online) {
    try {
      const res = await fetch(`${LOCAL_BRIDGE_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: targetCmd,
          app: app.name,
        }),
      });
      if (res.ok) {
        return {
          success: true,
          method: 'bridge',
          message: `Executed natively on local PC via JARVIS Bridge`,
          command: targetCmd,
        };
      }
    } catch (e: any) {
      console.warn('Bridge execution error:', e);
    }
  }

  // 2. If URI scheme is available, trigger browser OS protocol handler
  if (app.uriScheme) {
    try {
      if (app.uriScheme.startsWith('http://') || app.uriScheme.startsWith('https://')) {
        window.open(app.uriScheme, '_blank', 'noopener,noreferrer');
        return {
          success: true,
          method: 'web_open',
          message: `Opened web application target in browser`,
          command: targetCmd,
        };
      }

      // Launch URI scheme safely
      const tempLink = document.createElement('a');
      tempLink.href = app.uriScheme;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      setTimeout(() => tempLink.remove(), 1000);

      return {
        success: true,
        method: 'uri_protocol',
        message: `Dispatched native OS protocol (${app.uriScheme}) to launch ${app.name}`,
        command: targetCmd,
      };
    } catch (err: any) {
      console.warn('URI dispatch error:', err);
    }
  }

  // 3. Fallback: Generate one-click runner batch / shell script and copy command to clipboard
  try {
    await navigator.clipboard.writeText(targetCmd);
  } catch {
    // clipboard permission denied
  }

  // Also trigger download of quick runner file
  downloadQuickLauncher(app.name, targetCmd, os);

  return {
    success: true,
    method: 'download_script',
    message: `Generated instant launcher for ${app.name} & copied command to clipboard`,
    command: targetCmd,
  };
}

/**
 * Downloads a 1-click executable runner script (.bat for Windows, .sh for Mac/Linux)
 */
export function downloadQuickLauncher(appName: string, command: string, os: OSPlatform) {
  let fileContent = '';
  let fileName = '';
  let mimeType = 'text/plain';

  if (os === 'windows') {
    fileContent = `@echo off\n:: J.A.R.V.I.S. Quick Launcher for ${appName}\necho Launching ${appName} via JARVIS...\n${command}\nexit\n`;
    fileName = `launch_${appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.bat`;
    mimeType = 'application/x-bat';
  } else {
    fileContent = `#!/bin/bash\n# J.A.R.V.I.S. Quick Launcher for ${appName}\necho "Launching ${appName} via JARVIS..."\n${command}\n`;
    fileName = `launch_${appName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.sh`;
    mimeType = 'application/x-sh';
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}
