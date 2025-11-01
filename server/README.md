# Mock WebSocket Server

Real-time event and metric generator for testing Cerberus dashboard.

## Features

- WebSocket server on port 3001
- Auto-generates realistic events
- Broadcasts metrics every 3 seconds
- Status updates every 10 seconds
- Handles multiple concurrent clients
- Topic-based subscriptions
- Heartbeat/ping-pong support
- Graceful shutdown

## Quick Start

### Option 1: Using tsx (Recommended)

```bash
npm install ws tsx @types/ws

npx tsx server/websocket-server.ts
```

### Option 2: Using start script

```bash
chmod +x server/start.js

node server/start.js
```

### Option 3: Add to package.json

Add to your main package.json:

```json
{
  "scripts": {
    "ws:dev": "tsx server/websocket-server.ts",
    "ws:start": "node server/start.js"
  }
}
```

Then run:
```bash
npm run ws:dev
```

## Generated Data

### Events
- **Types**: user.login, payment.success, system.error, api.request, etc.
- **Frequency**: Every 2-5 seconds (random)
- **Severities**: low (50%), medium (30%), high (15%), critical (5%)
- **Metadata**: User IDs, transaction IDs, API endpoints, etc.

### Metrics
- **Types**: CPU, memory, network, API response time, active users, etc.
- **Frequency**: Every 3 seconds
- **Realistic values**: Based on metric type
- **Tags**: Server, region, service

### Status
- **Frequency**: Every 10 seconds
- **Info**: Connected clients, uptime, server time

## Server URL

```
ws://localhost:3001
```

## Testing

### 1. Start Server
```bash
npx tsx server/websocket-server.ts
```

### 2. Connect Client
Open your Next.js app with WebSocketProvider:
```typescript
<WebSocketProvider url="ws://localhost:3001">
  <App />
</WebSocketProvider>
```

### 3. Watch Console
Server will log:
- Client connections/disconnections
- Messages received
- Broadcasts sent

## Server Logs

```
Mock WebSocket Server started on ws://localhost:3001
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Waiting for client connections...

Client connected: client-1234567890-abc123 (Total: 1)
Broadcast event to 1 client(s)
Message from client-1234567890-abc123: heartbeat
Broadcast metric to 1 client(s)
```

## Configuration

Edit `websocket-server.ts` to customize:

- **Port**: Change `PORT` constant (default: 3001)
- **Event frequency**: Adjust `generateEvent()` delay (default: 2-5s)
- **Metric frequency**: Adjust `metricInterval` (default: 3s)
- **Status frequency**: Adjust `statusInterval` (default: 10s)

## Troubleshooting

### Port already in use
```bash
lsof -i :3001

kill -9 <PID>
```

### Module not found
```bash
npm install ws tsx @types/ws @types/node
```

### Server not responding
1. Check if server is running
2. Check firewall settings
3. Verify port 3001 is not blocked
4. Check console for errors

## API Reference

### Client → Server Messages

#### Subscribe to Topics
```typescript
{
  type: 'subscribe',
  payload: { topics: ['alerts', 'metrics'] }
}
```

#### Unsubscribe from Topics
```typescript
{
  type: 'unsubscribe',
  payload: { topics: ['alerts'] }
}
```

#### Heartbeat
```typescript
{
  type: 'heartbeat',
  payload: { timestamp: Date.now() }
}
```

### Server → Client Messages

#### Event
```typescript
{
  type: 'event',
  payload: {
    id: 'evt-...',
    timestamp: 1234567890,
    eventType: 'user.login',
    severity: 'low',
    message: 'User successfully logged in',
    source: 'web-app',
    metadata: { ... }
  }
}
```

#### Metric
```typescript
{
  type: 'metric',
  payload: {
    metricId: 'cpu_usage',
    timestamp: 1234567890,
    value: 45.2,
    tags: { server: 'server-1', region: 'us-east-1' }
  }
}
```

#### Status
```typescript
{
  type: 'status',
  payload: {
    connected: true,
    clients: 3,
    uptime: 123456,
    serverTime: 1234567890
  }
}
```

#### Pong (response to heartbeat)
```typescript
{
  type: 'pong',
  payload: {
    timestamp: 1234567890,
    clientId: 'client-...'
  }
}
```

## Production Considerations

This is a **MOCK SERVER** for development/testing only.

For production:
- Use a real WebSocket server (Socket.io, Pusher, Ably, etc.)
- Add authentication/authorization
- Implement rate limiting
- Add message validation
- Use secure WebSocket (wss://)
- Add monitoring and logging
- Implement proper error handling
- Use environment variables for configuration

## License

MIT