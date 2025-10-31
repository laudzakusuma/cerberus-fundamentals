export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type MessageType = 
  | 'event'
  | 'metric'
  | 'status'
  | 'subscribe'
  | 'unsubscribe'
  | 'heartbeat'
  | 'pong';

export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface WebSocketMessage<T = unknown> {
  type: MessageType;
  payload: T;
  timestamp?: number;
  id?: string;
}

export interface EventPayload {
  id: string;
  timestamp: number;
  eventType: string;
  severity: EventSeverity;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export type EventMessage = WebSocketMessage<EventPayload>;

export interface MetricPayload {
  metricId: string;
  timestamp: number;
  value: number;
  tags?: Record<string, string>;
}

export type MetricMessage = WebSocketMessage<MetricPayload>;

export interface StatusPayload {
  connected: boolean;
  clients: number;
  uptime: number;
  serverTime?: number;
}

export type StatusMessage = WebSocketMessage<StatusPayload>;

export interface SubscriptionPayload {
  topics: string[];
}

export type SubscriptionMessage = WebSocketMessage<SubscriptionPayload>;

export interface HeartbeatPayload {
  timestamp: number;
  clientId?: string;
}

export type HeartbeatMessage = WebSocketMessage<HeartbeatPayload>;

export type AnyWebSocketMessage = 
  | EventMessage
  | MetricMessage
  | StatusMessage
  | SubscriptionMessage
  | HeartbeatMessage;

export type EventListener<T = unknown> = (payload: T) => void;

export interface WebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
  debug?: boolean;
  autoConnect?: boolean;
}

export interface WebSocketState {
  connectionState: ConnectionState;
  reconnectAttempts: number;
  lastError: Error | null;
  connectedAt: number | null;
  disconnectedAt: number | null;
  messagesSent: number;
  messagesReceived: number;
  subscriptions: Set<string>;
}

export interface WebSocketStats {
  connectionState: ConnectionState;
  uptime: number;
  messagesSent: number;
  messagesReceived: number;
  reconnectAttempts: number;
  subscriptions: string[];
  lastError: string | null;
}