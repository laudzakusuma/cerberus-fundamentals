import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Event, EventFilters, EventStats } from './types';

interface EventState {
  // State
  events: Event[];
  filters: EventFilters;
  stats: EventStats;
  loading: boolean;
  error: string | null;
  selectedEventId: string | null;
  
  // Computed
  filteredEvents: () => Event[];
  
  // Actions
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  clearFilters: () => void;
  selectEvent: (id: string | null) => void;
  fetchEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  calculateStats: () => void;
}

const initialFilters: EventFilters = {
  type: undefined,
  level: undefined,
  dateRange: undefined,
  search: undefined,
};

export const useEventStore = create<EventState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        events: [],
        filters: initialFilters,
        stats: {
          total: 0,
          byLevel: {},
          byType: {},
        },
        loading: false,
        error: null,
        selectedEventId: null,

        // Computed selector
        filteredEvents: () => {
          const { events, filters } = get();
          
          return events.filter((event) => {
            // Type filter
            if (filters.type && event.type !== filters.type) {
              return false;
            }
            
            // Level filter
            if (filters.level && event.level !== filters.level) {
              return false;
            }
            
            // Date range filter
            if (filters.dateRange) {
              const eventDate = new Date(event.createdAt);
              if (
                eventDate < filters.dateRange.start ||
                eventDate > filters.dateRange.end
              ) {
                return false;
              }
            }
            
            // Search filter
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              const matchesMessage = event.message?.toLowerCase().includes(searchLower);
              const matchesSource = event.source?.toLowerCase().includes(searchLower);
              const matchesType = event.type.toLowerCase().includes(searchLower);
              
              if (!matchesMessage && !matchesSource && !matchesType) {
                return false;
              }
            }
            
            return true;
          });
        },

        // Actions
        setEvents: (events) =>
          set((state) => {
            state.events = events;
            state.loading = false;
          }),

        addEvent: (event) =>
          set((state) => {
            state.events.unshift(event);
            state.stats.total += 1;
            state.stats.byLevel[event.level] = (state.stats.byLevel[event.level] || 0) + 1;
            state.stats.byType[event.type] = (state.stats.byType[event.type] || 0) + 1;
          }),

        updateEvent: (id, updates) =>
          set((state) => {
            const index = state.events.findIndex((e) => e.id === id);
            if (index !== -1) {
              state.events[index] = { ...state.events[index], ...updates };
            }
          }),

        deleteEvent: (id) =>
          set((state) => {
            const event = state.events.find((e) => e.id === id);
            if (event) {
              state.events = state.events.filter((e) => e.id !== id);
              state.stats.total -= 1;
              state.stats.byLevel[event.level] -= 1;
              state.stats.byType[event.type] -= 1;
            }
          }),

        setFilters: (newFilters) =>
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = initialFilters;
          }),

        selectEvent: (id) =>
          set((state) => {
            state.selectedEventId = id;
          }),

        fetchEvents: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch('/api/events?limit=100');
            
            if (!response.ok) {
              throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            
            set((state) => {
              state.events = data.events;
              state.loading = false;
            });
            
            get().calculateStats();
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
              state.loading = false;
            });
          }
        },

        refreshEvents: async () => {
          await get().fetchEvents();
        },

        calculateStats: () =>
          set((state) => {
            const stats: EventStats = {
              total: state.events.length,
              byLevel: {},
              byType: {},
            };

            state.events.forEach((event) => {
              stats.byLevel[event.level] = (stats.byLevel[event.level] || 0) + 1;
              stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
            });

            state.stats = stats;
          }),
      })),
      {
        name: 'event-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'EventStore' }
  )
);