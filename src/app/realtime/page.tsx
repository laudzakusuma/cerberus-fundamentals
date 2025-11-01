'use client';

import React from 'react';
import { WebSocketProvider } from '@/lib/websocket/WebSocketContext';
import { ConnectionStatus } from '@/components/realtime/ConnectionStatus';
import { EventStream } from '@/components/realtime/EventStream';
import { WebSocketDebug } from '@/components/realtime/WebSocketDebug';

export default function RealtimeDashboard() {
  return (
    <WebSocketProvider
      url="ws://localhost:3001"
      debug={true}
      autoConnect={true}
      reconnectInterval={3000}
      maxReconnectAttempts={5}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ConnectionStatus showDetails={true} position="top-right" />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            Real-time Dashboard
          </h1>
          <div className="backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden h-[600px]">
            <EventStream
              maxEvents={100}
              autoScroll={true}
              showTimestamp={true}
              showSource={true}
            />
          </div>
        </div>
        <WebSocketDebug />
      </div>
    </WebSocketProvider>
  );
}