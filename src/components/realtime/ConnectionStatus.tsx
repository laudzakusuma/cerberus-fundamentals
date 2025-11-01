'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWebSocket } from '@/lib/websocket/WebSocketContext';
import type { ConnectionState } from '@/lib/websocket';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const stateConfig: Record<ConnectionState, {
  color: string;
  bgColor: string;
  label: string;
  icon: string;
}> = {
  disconnected: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    label: 'Disconnected',
    icon: '○',
  },
  connecting: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    label: 'Connecting',
    icon: '◐',
  },
  connected: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    label: 'Connected',
    icon: '●',
  },
  reconnecting: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    label: 'Reconnecting',
    icon: '◑',
  },
  error: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    label: 'Error',
    icon: '✕',
  },
};

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

export function ConnectionStatus({
  showDetails = false,
  className = '',
  position = 'top-right',
}: ConnectionStatusProps) {
  const { connectionState, stats, isConnected } = useWebSocket();
  const config = stateConfig[connectionState];

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="backdrop-blur-xl rounded-lg border shadow-lg"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          borderColor: config.color,
        }}
        whileHover={{ scale: showDetails ? 1 : 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {!showDetails && (
          <div className="px-3 py-2 flex items-center gap-2">
            <motion.div
              className="text-lg"
              animate={{
                rotate: connectionState === 'connecting' || connectionState === 'reconnecting' 
                  ? 360 
                  : 0,
              }}
              transition={{
                duration: 2,
                repeat: connectionState === 'connecting' || connectionState === 'reconnecting' 
                  ? Infinity 
                  : 0,
                ease: 'linear',
              }}
              style={{ color: config.color }}
            >
              {config.icon}
            </motion.div>
            <span className="text-sm font-medium text-white">
              {config.label}
            </span>
          </div>
        )}

        {showDetails && stats && (
          <div className="p-4 min-w-[200px]">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
              <motion.div
                className="text-2xl"
                animate={{
                  rotate: connectionState === 'connecting' || connectionState === 'reconnecting' 
                    ? 360 
                    : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: connectionState === 'connecting' || connectionState === 'reconnecting' 
                    ? Infinity 
                    : 0,
                  ease: 'linear',
                }}
                style={{ color: config.color }}
              >
                {config.icon}
              </motion.div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {config.label}
                </div>
                <div className="text-xs text-white/60">
                  WebSocket Status
                </div>
              </div>
            </div>
            {isConnected && (
              <div className="space-y-2">
                <StatRow label="Uptime" value={formatUptime(stats.uptime)} />
                <StatRow label="Sent" value={stats.messagesSent.toString()} />
                <StatRow label="Received" value={stats.messagesReceived.toString()} />
                {stats.subscriptions.length > 0 && (
                  <StatRow label="Topics" value={stats.subscriptions.length.toString()} />
                )}
              </div>
            )}
            {connectionState === 'reconnecting' && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <StatRow 
                  label="Attempts" 
                  value={`${stats.reconnectAttempts}`}
                />
              </div>
            )}
            {connectionState === 'error' && stats.lastError && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-red-400">
                  {stats.lastError}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-xs font-medium text-white">{value}</span>
    </div>
  );
}

export default ConnectionStatus;