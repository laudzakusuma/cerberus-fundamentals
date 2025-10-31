export interface Event {
  id: string;
  type: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source?: string;
  createdAt: string;
  metadata?: Record<string, any>;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface EventFilters {
  type?: string;
  level?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface EventStats {
  total: number;
  byLevel: Record<string, number>;
  byType: Record<string, number>;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  density: 'comfortable' | 'compact';
  animations: boolean;
}

export interface NotificationState {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  timestamp: number;
}