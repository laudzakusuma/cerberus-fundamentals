import type {
  WebSocketOptions,
  WebSocketState,
  WebSocketStats,
  ConnectionState,
  MessageType,
  AnyWebSocketMessage,
  EventListener,
  WebSocketMessage,
} from './types';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private options: Required<WebSocketOptions>;
  private state: WebSocketState;
  private listeners: Map<MessageType, Set<EventListener>>;
  private messageQueue: AnyWebSocketMessage[] = [];
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private clientId: string;

  constructor(options: WebSocketOptions) {
    this.options = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      heartbeatTimeout: 5000,
      debug: false,
      autoConnect: true,
      ...options,
    };

    this.clientId = this.generateClientId();
    this.listeners = new Map();
    this.state = this.createInitialState();

    if (this.options.autoConnect) {
      this.connect();
    }
  }

  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      this.log('Already connected or connecting');
      return;
    }

    this.updateConnectionState('connecting');
    this.log('Connecting to', this.options.url);

    try {
      this.ws = new WebSocket(this.options.url);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  public disconnect(): void {
    this.log('Disconnecting');
    this.stopHeartbeat();
    this.clearReconnectTimer();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.updateConnectionState('disconnected');
    this.state.disconnectedAt = Date.now();
  }

  public send<T>(type: MessageType, payload: T): void {
    const message: AnyWebSocketMessage = {
      type,
      payload,
      timestamp: Date.now(),
      id: this.generateMessageId(),
    } as AnyWebSocketMessage;

    if (this.isConnected()) {
      this.sendMessage(message);
    } else {
      this.log('Not connected, queuing message');
      this.messageQueue.push(message);
    }
  }

  public subscribe(topics: string[]): void {
    topics.forEach(topic => this.state.subscriptions.add(topic));
    
    if (this.isConnected()) {
      this.send('subscribe', { topics });
      this.log('Subscribed to topics:', topics);
    }
  }

  public unsubscribe(topics: string[]): void {
    topics.forEach(topic => this.state.subscriptions.delete(topic));
    
    if (this.isConnected()) {
      this.send('unsubscribe', { topics });
      this.log('Unsubscribed from topics:', topics);
    }
  }

  public on<T = unknown>(type: MessageType, listener: EventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    const listeners = this.listeners.get(type)!;
    listeners.add(listener as EventListener);

    return () => {
      listeners.delete(listener as EventListener);
    };
  }

  public off<T = unknown>(type: MessageType, listener: EventListener<T>): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener as EventListener);
    }
  }

  public getConnectionState(): ConnectionState {
    return this.state.connectionState;
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getStats(): WebSocketStats {
    return {
      connectionState: this.state.connectionState,
      uptime: this.state.connectedAt ? Date.now() - this.state.connectedAt : 0,
      messagesSent: this.state.messagesSent,
      messagesReceived: this.state.messagesReceived,
      reconnectAttempts: this.state.reconnectAttempts,
      subscriptions: Array.from(this.state.subscriptions),
      lastError: this.state.lastError?.message || null,
    };
  }

  public resetReconnectAttempts(): void {
    this.state.reconnectAttempts = 0;
  }

  private createInitialState(): WebSocketState {
    return {
      connectionState: 'disconnected',
      reconnectAttempts: 0,
      lastError: null,
      connectedAt: null,
      disconnectedAt: null,
      messagesSent: 0,
      messagesReceived: 0,
      subscriptions: new Set(),
    };
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => this.handleOpen();
    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onerror = (event) => this.handleWebSocketError(event);
    this.ws.onclose = (event) => this.handleClose(event);
  }

  private handleOpen(): void {
    this.log('Connected');
    this.updateConnectionState('connected');
    this.state.connectedAt = Date.now();
    this.state.reconnectAttempts = 0;

    this.startHeartbeat();

    if (this.state.subscriptions.size > 0) {
      this.subscribe(Array.from(this.state.subscriptions));
    }

    this.flushMessageQueue();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as AnyWebSocketMessage;
      this.state.messagesReceived++;

      this.log('Received message:', message.type);

      if (message.type === 'pong') {
        this.handlePong();
        return;
      }

      const listeners = this.listeners.get(message.type);
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(message.payload);
          } catch (error) {
            this.log('Error in listener:', error);
          }
        });
      }
    } catch (error) {
      this.log('Error parsing message:', error);
    }
  }

  private handleWebSocketError(event: Event): void {
    this.log('WebSocket error:', event);
    const error = new Error('WebSocket error occurred');
    this.handleError(error);
  }

  private handleClose(event: CloseEvent): void {
    this.log('Connection closed:', event.code, event.reason);
    this.stopHeartbeat();
    this.state.disconnectedAt = Date.now();

    if (event.code !== 1000 && this.shouldReconnect()) {
      this.updateConnectionState('reconnecting');
      this.scheduleReconnect();
    } else {
      this.updateConnectionState('disconnected');
    }
  }

  private handleError(error: Error): void {
    this.log('Error:', error.message);
    this.state.lastError = error;
    this.updateConnectionState('error');

    const listeners = this.listeners.get('status' as MessageType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener({ error: error.message });
        } catch (err) {
          this.log('Error in error listener:', err);
        }
      });
    }
  }

  private shouldReconnect(): boolean {
    return this.state.reconnectAttempts < this.options.maxReconnectAttempts;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.state.reconnectAttempts++;
    const delay = this.options.reconnectInterval * Math.pow(1.5, this.state.reconnectAttempts - 1);

    this.log(`Reconnecting in ${delay}ms (attempt ${this.state.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendHeartbeat();
        this.startHeartbeatTimeout();
      }
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private sendHeartbeat(): void {
    this.send('heartbeat', {
      timestamp: Date.now(),
      clientId: this.clientId,
    });
  }

  private startHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
    }

    this.heartbeatTimeoutTimer = setTimeout(() => {
      this.log('Heartbeat timeout - connection appears dead');
      this.ws?.close();
    }, this.options.heartbeatTimeout);
  }

  private handlePong(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  private sendMessage(message: AnyWebSocketMessage): void {
    if (!this.ws || !this.isConnected()) return;

    try {
      this.ws.send(JSON.stringify(message));
      this.state.messagesSent++;
      this.log('Sent message:', message.type);
    } catch (error) {
      this.log('Error sending message:', error);
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue(): void {
    if (this.messageQueue.length === 0) return;

    this.log(`Flushing ${this.messageQueue.length} queued messages`);

    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private updateConnectionState(state: ConnectionState): void {
    this.state.connectionState = state;
    this.log('Connection state:', state);
  }

  private generateClientId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private log(...args: unknown[]): void {
    if (this.options.debug) {
      console.log('[WebSocketManager]', ...args);
    }
  }

  public destroy(): void {
    this.disconnect();
    this.listeners.clear();
    this.messageQueue = [];
  }
}

export default WebSocketManager;