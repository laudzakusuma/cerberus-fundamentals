'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocketEventList } from '@/lib/websocket/WebSocketContext';
import type { EventPayload, EventSeverity } from '@/lib/websocket';

interface EventStreamProps {
  maxEvents?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  showSource?: boolean;
  filterSeverity?: EventSeverity[];
  className?: string;
}

const severityConfig: Record<EventSeverity, {
  color: string;
  bgColor: string;
  label: string;
  icon: string;
}> = {
  low: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    label: 'Low',
    icon: 'ℹ',
  },
  medium: {
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    label: 'Medium',
    icon: '◉',
  },
  high: {
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    label: 'High',
    icon: '⚠',
  },
  critical: {
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    label: 'Critical',
    icon: '✕',
  },
};

export function EventStream({
  maxEvents = 50,
  autoScroll = true,
  showTimestamp = true,
  showSource = true,
  filterSeverity,
  className = '',
}: EventStreamProps) {
  const { items: events, clear } = useWebSocketEventList<EventPayload>('event', maxEvents);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const filteredEvents = filterSeverity
    ? events.filter((event) => filterSeverity.includes(event.severity))
    : events;

  useEffect(() => {
    if (autoScroll && !isPaused && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredEvents, autoScroll, isPaused]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white">Live Events</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/60">{filteredEvents.length} events</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={clear}
            className="px-3 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence initial={false}>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-white/40 text-sm"
            >
              Waiting for events...
            </motion.div>
          ) : (
            filteredEvents.map((event, index) => (
              <EventItem
                key={event.id || index}
                event={event}
                showTimestamp={showTimestamp}
                showSource={showSource}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface EventItemProps {
  event: EventPayload;
  showTimestamp: boolean;
  showSource: boolean;
  index: number;
}

function EventItem({ event, showTimestamp, showSource, index }: EventItemProps) {
  const config = severityConfig[event.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3 p-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{
                color: config.color,
                backgroundColor: config.bgColor,
              }}
            >
              {config.label}
            </span>
            {showTimestamp && (
              <span className="text-xs text-white/40">
                {formatTime(event.timestamp)}
              </span>
            )}
            {showSource && event.source && (
              <span className="text-xs text-white/40">
                • {event.source}
              </span>
            )}
          </div>

          <div className="text-xs font-medium text-white/80 mb-1">
            {event.eventType}
          </div>

          <div className="text-sm text-white/90">
            {event.message}
          </div>

          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-2">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="text-xs px-2 py-1 rounded bg-white/5 text-white/60"
                  >
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default EventStream;