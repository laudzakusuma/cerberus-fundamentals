import * as ws from 'ws';

type GeneratedEvent = { topic: string; payload: any } | null;

type EventGenerator = () => GeneratedEvent;

type WebSocketMessage =
  | { type: 'heartbeat' }
  | { type: 'subscribe'; topic: string }
  | { type: 'unsubscribe'; topic: string }
  | { type: string; [k: string]: any };

interface Client {
  id: string;
  ws: ws.WebSocket;
  subscriptions: Set<string>;
  connectedAt: number;
  lastHeartbeat: number;
}

function now(): number {
  return Date.now();
}
function makeClientId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export class MockWebSocketServer {
  private wss: ws.WebSocketServer;
  private clients = new Map<string, Client>();
  private heartbeatIntervalMs = 30_000;
  private heartbeatChecker?: NodeJS.Timeout;
  private generatorInterval?: NodeJS.Timeout;

  private eventGenerator?: EventGenerator;

  /**
   * @param port server port
   * @param eventGenerator optional function that returns { topic, payload } or null when no event
   */
  constructor(private port: number = 8080, eventGenerator?: EventGenerator) {
    this.eventGenerator = eventGenerator ?? this.defaultEventGenerator();

    this.wss = new ws.WebSocketServer({ port: this.port });

    this.wss.on('listening', () => {
      console.log(`✅ WebSocket server listening on ws://localhost:${this.port}`);
    });

    this.wss.on('connection', (socket: ws.WebSocket, req) => {
      const path = req?.url ?? '/';
      this.handleConnection(socket, path);
    });

    this.wss.on('error', (err) => {
      console.error('WebSocketServer error:', err);
    });

    this.startHeartbeatChecker();
    this.startEventGenerator();
  }

  private handleConnection(socket: ws.WebSocket, path: string) {
    const id = makeClientId();
    const client: Client = {
      id,
      ws: socket,
      subscriptions: new Set(),
      connectedAt: now(),
      lastHeartbeat: now(),
    };
    this.clients.set(id, client);
    console.log(`Client connected: ${id} path=${path} (total: ${this.clients.size})`);

    socket.on('message', (data: ws.RawData) => this.handleMessage(client, data));
    socket.on('close', (code, reason) => {
      this.clients.delete(id);
      console.log(`Client disconnected: ${id} code=${code} reason=${reason?.toString() || ''} (total: ${this.clients.size})`);
    });
    socket.on('error', (err) => {
      console.error(`Socket error for client ${id}:`, err);
    });

    this.safeSend(client, { type: 'welcome', id, ts: now() });
  }

  private handleMessage(client: Client, data: ws.RawData) {
    try {
      const messageString = data.toString();
      const msg = JSON.parse(messageString) as WebSocketMessage;

      if (!msg || typeof msg.type !== 'string') {
        this.sendError(client, 'invalid_message');
        return;
      }

      switch (msg.type) {
        case 'heartbeat':
          this.handleHeartbeat(client);
          break;
        case 'subscribe':
          if (typeof (msg as any).topic === 'string') {
            this.handleSubscribe(client, (msg as any).topic);
          } else {
            this.sendError(client, 'subscribe_requires_topic');
          }
          break;
        case 'unsubscribe':
          if (typeof (msg as any).topic === 'string') {
            this.handleUnsubscribe(client, (msg as any).topic);
          } else {
            this.sendError(client, 'unsubscribe_requires_topic');
          }
          break;
        default:
          this.handleCustomMessage(client, msg);
          break;
      }
    } catch (err) {
      console.warn('Failed to parse/process message:', err);
      this.sendError(client, 'invalid_json');
    }
  }

  private handleHeartbeat(client: Client) {
    client.lastHeartbeat = now();
    this.safeSend(client, { type: 'heartbeat_ack', ts: now() });
  }

  private handleSubscribe(client: Client, topic: string) {
    client.subscriptions.add(topic);
    console.log(`${client.id} subscribed -> ${topic}`);
    this.safeSend(client, { type: 'subscribed', topic, ts: now() });
  }

  private handleUnsubscribe(client: Client, topic: string) {
    client.subscriptions.delete(topic);
    console.log(`${client.id} unsubscribed <- ${topic}`);
    this.safeSend(client, { type: 'unsubscribed', topic, ts: now() });
  }

  private handleCustomMessage(client: Client, msg: WebSocketMessage) {
    // default: echo back
    console.log(`Custom message from ${client.id}:`, msg);
    this.safeSend(client, { type: 'echo', original: msg, ts: now() });
  }

  private sendError(client: Client, errorCode: string) {
    this.safeSend(client, { type: 'error', error: errorCode, ts: now() });
  }

  private safeSend(client: Client, payload: any) {
    try {
      if (client.ws.readyState === ws.WebSocket.OPEN) {
        client.ws.send(JSON.stringify(payload));
      }
    } catch (err) {
      console.error(`Failed to send to ${client.id}:`, err);
    }
  }

  private startHeartbeatChecker() {
    const checkInterval = Math.max(5_000, Math.floor(this.heartbeatIntervalMs / 2));
    this.heartbeatChecker = setInterval(() => {
      const cutoff = now() - this.heartbeatIntervalMs * 2;
      for (const [id, client] of this.clients) {
        if (client.lastHeartbeat < cutoff) {
          console.log(`⌛ ${id} timed out (lastHeartbeat=${client.lastHeartbeat}). Terminate.`);
          try {
            client.ws.terminate();
          } catch (err) {
            console.error('Error terminating socket:', err);
          }
          this.clients.delete(id);
        }
      }
    }, checkInterval);
    if (this.heartbeatChecker.unref) this.heartbeatChecker.unref();
  }

  private startEventGenerator() {
    const intervalMs = 2000;
    if (!this.eventGenerator) return;

    this.generatorInterval = setInterval(() => {
      try {
        const ev = this.eventGenerator ? this.eventGenerator() : null;
        if (!ev) return;
        const { topic, payload } = ev;
        for (const [, client] of this.clients) {
          if (client.subscriptions.has(topic)) {
            this.safeSend(client, { type: 'event', topic, payload, ts: now() });
          }
        }
      } catch (err) {
        console.error('Event generator error:', err);
      }
    }, intervalMs);

    if (this.generatorInterval.unref) this.generatorInterval.unref();
  }

  private defaultEventGenerator(): EventGenerator {
    const topics = ['price.BTCUSD', 'price.ETHUSD', 'news.general'];
    let i = 0;
    return () => {
      const topic = topics[i % topics.length];
      const payload =
        topic.startsWith('price')
          ? { price: +(Math.random() * (70000 - 1000) + 1000).toFixed(2) }
          : { text: `Random notice #${Math.floor(Math.random() * 1000)}` };
      i += 1;
      return { topic, payload };
    };
  }

  public shutdown() {
    console.log('Shutting down WebSocket server...');
    if (this.heartbeatChecker) {
      clearInterval(this.heartbeatChecker);
      this.heartbeatChecker = undefined;
    }
    if (this.generatorInterval) {
      clearInterval(this.generatorInterval);
      this.generatorInterval = undefined;
    }

    for (const [, client] of this.clients) {
      try {
        client.ws.close(1001, 'server_shutdown');
      } catch (err) {
        //
      }
    }
    this.clients.clear();

    try {
      this.wss.close(() => {
        console.log('WebSocketServer closed.');
      });
    } catch (err) {
      console.error('Error closing WebSocketServer:', err);
    }
  }
}

if (require.main === module) {
  const port = parseInt(process.env.WS_PORT || '8080', 10);

  const server = new MockWebSocketServer(port);

  process.on('SIGINT', () => {
    console.log('Received SIGINT');
    server.shutdown();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    server.shutdown();
    process.exit(0);
  });
}

export default MockWebSocketServer;