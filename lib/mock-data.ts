import { Activity } from 'lucide-react';

export const metrics = {
  activeBots: 18,
  averageMemory: '1.1GB',
  connections: '146k',
  securedSecrets: '86',
};

export const dashboardBots = [
  { name: 'NovaManager', guilds: 440, uptime: '99.98%', plan: 'Growth' },
  { name: 'RaidGuard', guilds: 110, uptime: '99.95%', plan: 'Starter' },
  { name: 'AtlasBot', guilds: 260, uptime: '99.90%', plan: 'Growth' },
  { name: 'ZenSync', guilds: 80, uptime: '99.88%', plan: 'Starter' },
];

export const botCatalog = [
  { name: 'NovaManager', type: 'Moderation', status: 'online', region: 'Frankfurt', uptime: '99.98%' },
  { name: 'RaidGuard', type: 'Anti-raid', status: 'online', region: 'US East', uptime: '99.95%' },
  { name: 'AtlasBot', type: 'Utility', status: 'restarting', region: 'London', uptime: '99.90%' },
  { name: 'BreezeCore', type: 'Music', status: 'online', region: 'Singapore', uptime: '99.92%' },
];
