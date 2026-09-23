export type AppCategory =
  | 'Development'
  | 'Productivity'
  | 'System'
  | 'Communication'
  | 'Media'
  | 'Gaming'
  | 'Custom';

export interface DesktopApp {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  iconName: string;
  uriScheme?: string;
  windowsCmd: string;
  macCmd: string;
  linuxCmd: string;
  voiceKeywords: string[];
  isCustom?: boolean;
  color: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  query: string;
  targetApp: string;
  command: string;
  status: 'executed' | 'protocol_launched' | 'bridge_dispatched' | 'script_ready' | 'failed';
  method: 'bridge' | 'uri_protocol' | 'download_script' | 'web_open';
  voiceResponse: string;
  hindiResponse?: string;
}

export interface JarvisCommandResult {
  intent: 'launch_app' | 'system_control' | 'generate_script' | 'query';
  targetApp: string;
  executable?: string;
  uriScheme?: string;
  command: string;
  voiceResponse: string;
  hindiResponse?: string;
  scriptContent?: string;
  explanation?: string;
}

export type OSPlatform = 'windows' | 'mac' | 'linux';

export type JarvisStatus = 'standby' | 'listening' | 'processing' | 'speaking' | 'executing';
