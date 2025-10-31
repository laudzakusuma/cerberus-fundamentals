'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { WebSocketManager } from './WebSocketManager';
import type {
  ConnectionState,
  MessageType,
  EventListener,
  WebSocketStats,
  EventPayload,
  MetricPayload,
  StatusPayload,
} from './types';

interface WebSocketContextValue {
  connectionState: ConnectionState;
  isConnected: boolean;
  
  connect: () => void;
  disconnect: () => void;
  send: <T>(type: MessageType, payload: T) => void;
  subscribe: (topics: string[]) => void;
  unsubscribe: (topics: string[]) => void;
  on: <T = unknown>(type: MessageType, listener: EventListener<T>) => () => void;
  
  stats: WebSocketStats | null;
  
  manager: WebSocketManager | null;
}

interface WebSocketProviderProps {
  children: React.ReactNode;
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
  autoConnect?: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({
  children,
  url,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  heartbeatInterval = 30000,
  debug = false,
  autoConnect = true,
}: WebSocketProviderProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [stats, setStats] = useState<WebSocketStats | null>(null);
  const managerRef = useRef<WebSocketManager | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const manager = new WebSocketManager({
      url,
      reconnectInterval,
      maxReconnectAttempts,
      heartbeatInterval,
      debug,
      autoConnect,
    });

    managerRef.current = manager;

    const unsubscribe = manager.on('status', () => {
      setConnectionState(manager.getConnectionState());
      setStats(manager.getStats());
    });

    const updateStats = () => {
      if (managerRef.current) {
        setConnectionState(managerRef.current.getConnectionState());
        setStats(managerRef.current.getStats());
      }
    };

    updateStats();
    statsIntervalRef.current = setInterval(updateStats, 1000);

    return () => {
      unsubscribe();
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      manager.destroy();
      managerRef.current = null;
    };
  }, [url, reconnectInterval, maxReconnectAttempts, heartbeatInterval, debug, autoConnect]);

  const connect = useCallback(() => {
    managerRef.current?.connect();
  }, []);

  const disconnect = useCallback(() => {
    managerRef.current?.disconnect();
  }, []);

  const send = useCallback(<T,>(type: MessageType, payload: T) => {
    managerRef.current?.send(type, payload);
  }, []);

  const subscribe = useCallback((topics: string[]) => {
    managerRef.current?.subscribe(topics);
  }, []);

  const unsubscribe = useCallback((topics: string[]) => {
    managerRef.current?.unsubscribe(topics);
  }, []);

  const on = useCallback(<T = unknown>(type: MessageType, listener: EventListener<T>) => {
    if (!managerRef.current) {
      return () => {};
    }
    return managerRef.current.on(type, listener);
  }, []);

  const value: WebSocketContextValue = {
    connectionState,
    isConnected: connectionState === 'connected',
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe,
    on,
    stats,
    manager: managerRef.current,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  
  return context;
}

export function useWebSocketEvent<T = unknown>(
  type: MessageType,
  handler: EventListener<T>,
  deps: React.DependencyList = []
) {
  const { on } = useWebSocket();

  useEffect(() => {
    const unsubscribe = on<T>(type, handler);
    return unsubscribe;
  }, [type, on, ...deps]);
}

export function useWebSocketSubscription(topics: string[]) {
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    if (topics.length > 0) {
      subscribe(topics);
    }

    return () => {
      if (topics.length > 0) {
        unsubscribe(topics);
      }
    };
  }, [topics.join(','), subscribe, unsubscribe]);
}

export function useWebSocketEventState<T>(type: MessageType, initialValue: T | null = null) {
  const [data, setData] = useState<T | null>(initialValue);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  useWebSocketEvent<T>(
    type,
    (payload) => {
      setData(payload);
      setLastUpdate(Date.now());
    },
    []
  );

  return { data, lastUpdate };
}

export function useWebSocketEventList<T>(
  type: MessageType,
  maxItems: number = 100
) {
  const [items, setItems] = useState<T[]>([]);

  useWebSocketEvent<T>(
    type,
    (payload) => {
      setItems((prev) => {
        const newItems = [payload, ...prev];
        return newItems.slice(0, maxItems);
      });
    },
    []
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return { items, clear };
}

export function useWebSocketEvents(
  handler: EventListener<EventPayload>,
  deps: React.DependencyList = []
) {
  useWebSocketEvent<EventPayload>('event', handler, deps);
}

export function useWebSocketMetrics(
  handler: EventListener<MetricPayload>,
  deps: React.DependencyList = []
) {
  useWebSocketEvent<MetricPayload>('metric', handler, deps);
}

export function useWebSocketStatus(
  handler: EventListener<StatusPayload>,
  deps: React.DependencyList = []
) {
  useWebSocketEvent<StatusPayload>('status', handler, deps);
}

export default WebSocketContext;