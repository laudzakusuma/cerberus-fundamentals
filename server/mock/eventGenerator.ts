export type EventSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface EventPayload {
  id: string;
  timestamp: number;
  eventType: string;
  severity: EventSeverity;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface MetricPayload {
  metricId: string;
  timestamp: number;
  value: number;
  tags?: Record<string, string>;
}

export interface StatusPayload {
  connected: boolean;
  clients: number;
  uptime: number;
  serverTime?: number;
}

const EVENT_TYPES = [
  'user.login',
  'user.logout',
  'user.signup',
  'system.error',
  'system.warning',
  'payment.success',
  'payment.failed',
  'api.request',
  'api.error',
  'database.slow_query',
  'cache.miss',
  'cache.hit',
  'deployment.started',
  'deployment.completed',
  'deployment.failed',
  'security.suspicious_activity',
  'security.blocked_ip',
];

const SOURCES = [
  'web-app',
  'mobile-app',
  'api-gateway',
  'database',
  'cache-server',
  'payment-service',
  'auth-service',
  'notification-service',
];

const METRIC_IDS = [
  'cpu_usage',
  'memory_usage',
  'disk_usage',
  'network_throughput',
  'api_response_time',
  'active_users',
  'requests_per_second',
  'error_rate',
  'cache_hit_rate',
  'database_connections',
];

const MESSAGE_TEMPLATES: Record<string, string[]> = {
  'user.login': [
    'User successfully logged in',
    'New user session started',
    'Authentication successful',
  ],
  'user.logout': [
    'User logged out',
    'Session ended',
    'User signed out successfully',
  ],
  'system.error': [
    'Internal server error occurred',
    'Service temporarily unavailable',
    'Unexpected error in system module',
  ],
  'system.warning': [
    'High memory usage detected',
    'Slow response time detected',
    'Disk space running low',
  ],
  'payment.success': [
    'Payment processed successfully',
    'Transaction completed',
    'Payment confirmation received',
  ],
  'payment.failed': [
    'Payment processing failed',
    'Transaction declined',
    'Payment gateway error',
  ],
  'api.request': [
    'API request received',
    'Endpoint accessed',
    'Service request processed',
  ],
  'security.suspicious_activity': [
    'Multiple failed login attempts detected',
    'Unusual access pattern identified',
    'Potential security threat detected',
  ],
};

const SEVERITY_WEIGHTS: Record<EventSeverity, number> = {
  low: 50,
  medium: 30,
  high: 15,
  critical: 5,
};

export class EventGenerator {
  private eventCounter = 0;
  private metricCounter = 0;

  generateEvent(): EventPayload {
    const eventType = this.randomItem(EVENT_TYPES);
    const severity = this.randomSeverity();
    const source = this.randomItem(SOURCES);
    const messages = MESSAGE_TEMPLATES[eventType] || ['Event occurred'];
    const message = this.randomItem(messages);

    this.eventCounter++;

    return {
      id: `evt-${Date.now()}-${this.eventCounter}`,
      timestamp: Date.now(),
      eventType,
      severity,
      message,
      source,
      metadata: this.generateEventMetadata(eventType),
    };
  }

  generateMetric(): MetricPayload {
    const metricId = this.randomItem(METRIC_IDS);
    const value = this.generateMetricValue(metricId);

    this.metricCounter++;

    return {
      metricId,
      timestamp: Date.now(),
      value,
      tags: this.generateMetricTags(metricId),
    };
  }

  generateStatus(clients: number): StatusPayload {
    return {
      connected: true,
      clients,
      uptime: process.uptime() * 1000,
      serverTime: Date.now(),
    };
  }

  generateSpecificEvent(eventType: string, severity: EventSeverity): EventPayload {
    const source = this.randomItem(SOURCES);
    const messages = MESSAGE_TEMPLATES[eventType] || ['Event occurred'];
    const message = this.randomItem(messages);

    this.eventCounter++;

    return {
      id: `evt-${Date.now()}-${this.eventCounter}`,
      timestamp: Date.now(),
      eventType,
      severity,
      message,
      source,
      metadata: this.generateEventMetadata(eventType),
    };
  }

  generateEventBatch(count: number): EventPayload[] {
    return Array.from({ length: count }, () => this.generateEvent());
  }

  generateMetricBatch(count: number): MetricPayload[] {
    return Array.from({ length: count }, () => this.generateMetric());
  }

  private randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomSeverity(): EventSeverity {
    const total = Object.values(SEVERITY_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;

    for (const [severity, weight] of Object.entries(SEVERITY_WEIGHTS)) {
      random -= weight;
      if (random <= 0) {
        return severity as EventSeverity;
      }
    }

    return 'low';
  }

  private generateEventMetadata(eventType: string): Record<string, unknown> {
    const baseMetadata: Record<string, unknown> = {
      eventId: Math.random().toString(36).substring(7),
      environment: 'production',
    };

    if (eventType.startsWith('user.')) {
      baseMetadata.userId = `user-${Math.floor(Math.random() * 1000)}`;
      baseMetadata.sessionId = Math.random().toString(36).substring(7);
    }

    if (eventType.startsWith('payment.')) {
      baseMetadata.amount = (Math.random() * 1000).toFixed(2);
      baseMetadata.currency = 'USD';
      baseMetadata.transactionId = `txn-${Math.random().toString(36).substring(7)}`;
    }

    if (eventType.startsWith('api.')) {
      baseMetadata.endpoint = `/api/${this.randomItem(['users', 'products', 'orders', 'payments'])}`;
      baseMetadata.method = this.randomItem(['GET', 'POST', 'PUT', 'DELETE']);
      baseMetadata.statusCode = this.randomItem([200, 201, 400, 404, 500]);
      baseMetadata.responseTime = Math.floor(Math.random() * 1000);
    }

    if (eventType.startsWith('security.')) {
      baseMetadata.ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      baseMetadata.userAgent = 'Mozilla/5.0...';
    }

    return baseMetadata;
  }

  private generateMetricValue(metricId: string): number {
    switch (metricId) {
      case 'cpu_usage':
      case 'memory_usage':
      case 'disk_usage':
      case 'cache_hit_rate':
      case 'error_rate':
        return Math.random() * 100;
      
      case 'network_throughput':
        return Math.random() * 1000;
      
      case 'api_response_time':
        return Math.random() * 500;
      
      case 'active_users':
        return Math.floor(Math.random() * 10000);
      
      case 'requests_per_second':
        return Math.floor(Math.random() * 1000);
      
      case 'database_connections':
        return Math.floor(Math.random() * 100);
      
      default:
        return Math.random() * 100;
    }
  }

  private generateMetricTags(metricId: string): Record<string, string> {
    const tags: Record<string, string> = {
      server: this.randomItem(['server-1', 'server-2', 'server-3']),
      region: this.randomItem(['us-east-1', 'us-west-2', 'eu-west-1']),
    };

    if (metricId.includes('api')) {
      tags.service = 'api-gateway';
    } else if (metricId.includes('database')) {
      tags.service = 'postgresql';
    } else if (metricId.includes('cache')) {
      tags.service = 'redis';
    }

    return tags;
  }
}

export const eventGenerator = new EventGenerator();