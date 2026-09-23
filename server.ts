import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let PORT = 3000;
const portArgIndex = process.argv.indexOf('--port');
if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
  PORT = parseInt(process.argv[portArgIndex + 1], 10);
} else if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10);
}

app.use(express.json());

// CORS for local communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Local fallback parser for instant responses or during transient model spikes
function fallbackLocalCommandParser(query: string, os: string) {
  const q = query.toLowerCase();
  
  if (q.includes('notepad') || q.includes('note') || q.includes('text')) {
    return {
      intent: 'launch_app',
      targetApp: 'Notepad',
      executable: 'notepad.exe',
      command: os === 'windows' ? 'start notepad.exe' : os === 'mac' ? 'open -a TextEdit' : 'gedit',
      voiceResponse: 'Opening Notepad for you, Sir.',
      hindiResponse: 'जी सर, Notepad खोला जा रहा है।',
      explanation: 'Native text editor launched.',
    };
  }

  if (q.includes('calc') || q.includes('calculator') || q.includes('hisaab') || q.includes('hisab')) {
    return {
      intent: 'launch_app',
      targetApp: 'Calculator',
      executable: 'calc.exe',
      uriScheme: 'calculator:',
      command: os === 'windows' ? 'start calc.exe' : os === 'mac' ? 'open -a Calculator' : 'gnome-calculator',
      voiceResponse: 'Launching Calculator, Sir.',
      hindiResponse: 'जी सर, Calculator खोला जा रहा है।',
      explanation: 'System math calculator launched.',
    };
  }

  if (q.includes('code') || q.includes('vs code') || q.includes('visual studio')) {
    return {
      intent: 'launch_app',
      targetApp: 'Visual Studio Code',
      executable: 'code',
      uriScheme: 'vscode://',
      command: 'code .',
      voiceResponse: 'Initiating Visual Studio Code workspace, Sir.',
      hindiResponse: 'जी सर, Visual Studio Code खोला जा रहा है।',
      explanation: 'Code editor opened with current workspace.',
    };
  }

  if (q.includes('chrome') || q.includes('browser') || q.includes('google')) {
    return {
      intent: 'launch_app',
      targetApp: 'Google Chrome',
      executable: 'chrome.exe',
      uriScheme: 'https://www.google.com',
      command: os === 'windows' ? 'start chrome' : os === 'mac' ? "open -a 'Google Chrome'" : 'google-chrome',
      voiceResponse: 'Launching Google Chrome, Sir.',
      hindiResponse: 'जी सर, Chrome ब्राउज़र खोला जा रहा है।',
      explanation: 'Web browser opened.',
    };
  }

  if (q.includes('spotify') || q.includes('music') || q.includes('gaana') || q.includes('song')) {
    return {
      intent: 'launch_app',
      targetApp: 'Spotify',
      executable: 'spotify.exe',
      uriScheme: 'spotify:',
      command: os === 'windows' ? 'start spotify' : os === 'mac' ? 'open -a Spotify' : 'spotify',
      voiceResponse: 'Starting Spotify playback system, Sir.',
      hindiResponse: 'जी सर, Spotify म्यूजिक प्लेयर खोला जा रहा है।',
      explanation: 'Music player launched.',
    };
  }

  if (q.includes('task manager') || q.includes('taskmgr') || q.includes('process')) {
    return {
      intent: 'system_control',
      targetApp: 'Task Manager',
      executable: 'taskmgr.exe',
      command: os === 'windows' ? 'start taskmgr.exe' : os === 'mac' ? "open -a 'Activity Monitor'" : 'gnome-system-monitor',
      voiceResponse: 'Displaying system diagnostics and Task Manager, Sir.',
      hindiResponse: 'जी सर, Task Manager खोला जा रहा है।',
      explanation: 'System process monitor opened.',
    };
  }

  if (q.includes('file') || q.includes('explorer') || q.includes('folder')) {
    return {
      intent: 'launch_app',
      targetApp: 'File Explorer',
      executable: 'explorer.exe',
      command: os === 'windows' ? 'start explorer.exe' : os === 'mac' ? 'open .' : 'xdg-open .',
      voiceResponse: 'Opening File Explorer, Sir.',
      hindiResponse: 'जी सर, File Explorer खोला जा रहा है।',
      explanation: 'File directory opened.',
    };
  }

  if (q.includes('terminal') || q.includes('cmd') || q.includes('command prompt') || q.includes('powershell')) {
    return {
      intent: 'launch_app',
      targetApp: 'Command Prompt',
      executable: 'cmd.exe',
      command: os === 'windows' ? 'start cmd.exe' : os === 'mac' ? 'open -a Terminal' : 'gnome-terminal',
      voiceResponse: 'Opening terminal shell, Sir.',
      hindiResponse: 'जी सर, Terminal खोला जा रहा है।',
      explanation: 'Command line console opened.',
    };
  }

  if (q.includes('paint') || q.includes('draw')) {
    return {
      intent: 'launch_app',
      targetApp: 'MS Paint',
      executable: 'mspaint.exe',
      command: os === 'windows' ? 'start mspaint.exe' : os === 'mac' ? "open -a 'Preview'" : 'gimp',
      voiceResponse: 'Launching Paint graphics tool, Sir.',
      hindiResponse: 'जी सर, Paint खोला जा रहा है।',
      explanation: 'Image editor launched.',
    };
  }

  // Generic fallback
  return {
    intent: 'query',
    targetApp: 'System Protocol',
    command: `echo Execution completed for: ${query}`,
    voiceResponse: `Acknowledged instruction: "${query}". System standing by, Sir.`,
    hindiResponse: `कमांड प्राप्त हुआ: "${query}". सिस्टम तैयार है, सर।`,
    explanation: 'Processed through JARVIS neural subsystem.',
  };
}

// Endpoint: Process JARVIS Natural Language / Voice Command
app.post('/api/jarvis/command', async (req, res) => {
  const { query, os = 'windows', lang = 'auto', localBridgeConnected = false } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }

  try {
    const systemInstruction = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), the sophisticated AI assistant inspired by Tony Stark's personal system.
Your mission is to understand user voice/text commands in English or Hindi/Hinglish, identify target desktop PC applications to run or PC tasks to execute, and return structured command data.

OS Target: ${os} (Windows, macOS, or Linux).
Local Desktop Bridge Active: ${localBridgeConnected ? 'YES (commands can be executed natively on local machine)' : 'NO (fallback to browser URI schemes, web launches, or batch generation)'}.

Identify whether this is:
- "launch_app": Launching a desktop or web app
- "system_control": System actions like volume, lock screen, tasklist, ping, shutdown timer, ipconfig
- "generate_script": User asking for a script or automated sequence
- "query": General conversation or query

Tone: Crisp, dignified, polite, slightly dry British AI persona ("At your service, Sir", "Right away, Sir", "Initiating protocol").
If the query was in Hindi/Hinglish (e.g., "Chrome kholo", "Notepad chalao", "Calculator open karo"), provide both an English voiceResponse and a polite Hindi/Hinglish voiceResponse ("hindiResponse").`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `User voice/command: "${query}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: 'launch_app, system_control, generate_script, or query',
            },
            targetApp: {
              type: Type.STRING,
              description: 'Name of the application or tool, e.g. VS Code, Chrome, Notepad, Calculator, Spotify, etc.',
            },
            executable: {
              type: Type.STRING,
              description: 'Primary executable name (e.g. notepad.exe, calc.exe, code, chrome.exe)',
            },
            uriScheme: {
              type: Type.STRING,
              description: 'Browser-callable URI protocol scheme if applicable (e.g. vscode://, spotify:, calculator:, ms-settings:, https://...)',
            },
            command: {
              type: Type.STRING,
              description: 'Exact OS terminal/shell command to execute the action',
            },
            voiceResponse: {
              type: Type.STRING,
              description: 'Jarvis spoken response in English',
            },
            hindiResponse: {
              type: Type.STRING,
              description: 'Jarvis spoken response in Hindi/Hinglish if applicable',
            },
            scriptContent: {
              type: Type.STRING,
              description: 'Optional script code snippet (.bat, .ps1, .sh, or .py) if user asked to create automation',
            },
            explanation: {
              type: Type.STRING,
              description: 'Brief technical description of what will execute',
            },
          },
          required: ['intent', 'targetApp', 'command', 'voiceResponse'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    // Graceful fallback without dumping raw 503 error traces to console
    const fallbackData = fallbackLocalCommandParser(query, os);
    return res.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      timestamp: new Date().toISOString(),
    });
  }
});

// Endpoint: Generate Desktop Local Bridge Files
app.get('/api/jarvis/bridge-script', (req, res) => {
  const type = (req.query.type as string) || 'node';

  if (type === 'python') {
    const pythonScript = `#!/usr/bin/env python3
"""
===================================================================
J.A.R.V.I.S. PC DESKTOP BRIDGE - PYTHON DAEMON
===================================================================
This lightweight server runs locally on your PC (port 7890).
It allows the JARVIS Web HUD to execute apps and commands directly!

Usage:
  python jarvis_bridge.py
===================================================================
"""

import http.server
import socketserver
import json
import subprocess
import os
import platform

PORT = 7890

class JarvisBridgeHandler(http.server.BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/status' or self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            status_data = {
                "status": "online",
                "bridge": "JARVIS Python Native Bridge",
                "os": platform.system(),
                "node": platform.node(),
                "version": "1.0.0"
            }
            self.wfile.write(json.dumps(status_data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/run' or self.path == '/exec':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                data = json.loads(body)
                command = data.get('command', '')
                app_name = data.get('app', 'App')

                print(f"[JARVIS PROTOCOL] Executing: {command} ({app_name})")

                # Cross-platform command execution
                current_os = platform.system().lower()
                if 'windows' in current_os:
                    # Run without blocking the bridge
                    subprocess.Popen(command, shell=True)
                else:
                    subprocess.Popen(command, shell=True)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                res = {
                    "success": True,
                    "message": f"Successfully launched {app_name}",
                    "command": command
                }
                self.wfile.write(json.dumps(res).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

print("="*60)
print(f" J.A.R.V.I.S. DESKTOP LOCAL BRIDGE ACTIVE ON PORT {PORT}")
print(f" System: {platform.system()} | Host: {platform.node()}")
print(" Keep this terminal open to launch any PC app seamlessly!")
print("="*60)

with socketserver.TCPServer(("", PORT), JarvisBridgeHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n[JARVIS] Desktop Bridge terminated safely.")
`;
    res.setHeader('Content-Type', 'text/x-python');
    res.setHeader('Content-Disposition', 'attachment; filename="jarvis_bridge.py"');
    return res.send(pythonScript);
  }

  // Node.js bridge default
  const nodeScript = `/**
 * ===================================================================
 * J.A.R.V.I.S. PC DESKTOP BRIDGE - NODE.JS DAEMON
 * ===================================================================
 * This zero-dependency script connects the JARVIS Web HUD directly
 * to your local operating system (Windows / macOS / Linux).
 *
 * Usage:
 *   node jarvis-bridge.js
 * ===================================================================
 */

const http = require('http');
const { exec } = require('child_process');
const os = require('os');

const PORT = 7890;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && (req.url === '/status' || req.url === '/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      bridge: 'JARVIS Node.js Native Bridge',
      os: os.platform(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      version: '1.0.0'
    }));
    return;
  }

  // Command Execution Endpoint
  if (req.method === 'POST' && (req.url === '/run' || req.url === '/exec')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { command, app = 'Application' } = JSON.parse(body);
        console.log(\`\\x1b[36m[JARVIS]\x1b[0m Executing command: \x1b[32m\${command}\x1b[0m (\${app})\`);

        // Execute natively
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.warn(\`\\x1b[33m[JARVIS WARN]\x1b[0m \${error.message}\`);
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: \`Dispatched '\${command}' to OS\`,
          app
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log('\\x1b[36m%s\\x1b[0m', '=======================================================');
  console.log('\\x1b[36m%s\\x1b[0m', ' J.A.R.V.I.S. PC DESKTOP BRIDGE ACTIVE');
  console.log(\` Listening on: \\x1b[32mhttp://localhost:\${PORT}\\x1b[0m\`);
  console.log(\` Platform: \\x1b[35m\${os.platform()} (\${os.arch()})\\x1b[0m | Host: \${os.hostname()}\`);
  console.log(' All voice & app launch commands from JARVIS HUD will run natively!');
  console.log('\\x1b[36m%s\\x1b[0m', '=======================================================');
});
`;

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Content-Disposition', 'attachment; filename="jarvis-bridge.js"');
  return res.send(nodeScript);
});

// App server setup (dev vs prod)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JARVIS Core server active on port ${PORT}`);
  });
}

startServer();
