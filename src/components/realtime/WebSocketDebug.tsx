'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '@/lib/websocket/WebSocketContext';
import type { MessageType } from '@/lib/websocket';

export function WebSocketDebug() {
  const { stats, connectionState, isConnected, send, subscribe, unsubscribe } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'send' | 'subscribe'>('stats');
  const [messageType, setMessageType] = useState<MessageType>('event');
  const [messagePayload, setMessagePayload] = useState('{"test": "data"}');
  const [topics, setTopics] = useState('test-topic');

  const handleSend = () => {
    try {
      const payload = JSON.parse(messagePayload);
      send(messageType, payload);
      alert('Message sent!');
    } catch (error) {
      alert('Invalid JSON payload');
    }
  };

  const handleSubscribe = () => {
    const topicList = topics.split(',').map(t => t.trim()).filter(Boolean);
    subscribe(topicList);
    alert(`Subscribed to: ${topicList.join(', ')}`);
  };

  const handleUnsubscribe = () => {
    const topicList = topics.split(',').map(t => t.trim()).filter(Boolean);
    unsubscribe(topicList);
    alert(`Unsubscribed from: ${topicList.join(', ')}`);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '⚙'}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-4 z-50 w-96 max-h-[600px] backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <div className="px-4 py-3 border-b border-white/10 bg-purple-600/20">
              <h3 className="text-sm font-semibold text-white">
                WebSocket Debug Panel
              </h3>
            </div>
            <div className="flex border-b border-white/10">
              <TabButton
                active={activeTab === 'stats'}
                onClick={() => setActiveTab('stats')}
              >
                Statistics
              </TabButton>
              <TabButton
                active={activeTab === 'send'}
                onClick={() => setActiveTab('send')}
              >
                Send Message
              </TabButton>
              <TabButton
                active={activeTab === 'subscribe'}
                onClick={() => setActiveTab('subscribe')}
              >
                Subscribe
              </TabButton>
            </div>
            <div className="p-4 overflow-y-auto max-h-[500px]">
              {activeTab === 'stats' && stats && (
                <div className="space-y-3">
                  <StatItem label="Connection State" value={connectionState} />
                  <StatItem label="Is Connected" value={isConnected ? 'Yes' : 'No'} />
                  <StatItem label="Uptime" value={`${Math.floor(stats.uptime / 1000)}s`} />
                  <StatItem label="Messages Sent" value={stats.messagesSent} />
                  <StatItem label="Messages Received" value={stats.messagesReceived} />
                  <StatItem label="Reconnect Attempts" value={stats.reconnectAttempts} />
                  <StatItem 
                    label="Active Subscriptions" 
                    value={stats.subscriptions.length > 0 
                      ? stats.subscriptions.join(', ') 
                      : 'None'
                    } 
                  />
                  {stats.lastError && (
                    <StatItem label="Last Error" value={stats.lastError} error />
                  )}
                </div>
              )}

              {activeTab === 'send' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Message Type
                    </label>
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value as MessageType)}
                      className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="event">event</option>
                      <option value="metric">metric</option>
                      <option value="status">status</option>
                      <option value="subscribe">subscribe</option>
                      <option value="unsubscribe">unsubscribe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Payload (JSON)
                    </label>
                    <textarea
                      value={messagePayload}
                      onChange={(e) => setMessagePayload(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-purple-500 resize-none"
                      rows={6}
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!isConnected}
                    className="w-full px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              )}

              {activeTab === 'subscribe' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      Topics (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      placeholder="alerts, metrics, events"
                      className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSubscribe}
                      disabled={!isConnected}
                      className="flex-1 px-4 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >
                      Subscribe
                    </button>
                    <button
                      onClick={handleUnsubscribe}
                      disabled={!isConnected}
                      className="flex-1 px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >
                      Unsubscribe
                    </button>
                  </div>

                  {stats && stats.subscriptions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs font-medium text-white/80 mb-2">
                        Current Subscriptions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stats.subscriptions.map((topic) => (
                          <div
                            key={topic}
                            className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs"
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 text-xs font-medium transition-colors ${
        active
          ? 'text-white bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function StatItem({
  label,
  value,
  error = false,
}: {
  label: string;
  value: string | number;
  error?: boolean;
}) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs text-white/60">{label}</span>
      <span
        className={`text-xs font-medium text-right max-w-[200px] break-words ${
          error ? 'text-red-400' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default WebSocketDebug;