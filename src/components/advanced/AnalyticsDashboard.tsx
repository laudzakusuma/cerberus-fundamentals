import { useState, useEffect } from 'react';
import { styled } from '@/styles/design-tokens';
import { DataTable, type Column } from '@/visualization/components/DataTable';
import { LineChart } from '@/visualization/components/LineChart';
import type { TimeSeriesData } from '@/visualization/types';
import { DataProcessor } from '@/visualization/utils/dataProcessor';

const DashboardContainer = styled('div', {
  padding: '$8',
  maxWidth: '1400px',
  margin: '0 auto',
});

const DashboardGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: '$6',
  marginBottom: '$6',
});

const ChartSection = styled('div', {
  gridColumn: 'span 12',
  backgroundColor: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  padding: '$6',
});

const TableSection = styled('div', {
  gridColumn: 'span 12',
});

const SectionTitle = styled('h2', {
  fontSize: '$2xl',
  fontWeight: '$bold',
  color: '$text',
  marginBottom: '$4',
});

const StatsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$4',
  marginBottom: '$6',
});

const StatCard = styled('div', {
  padding: '$5',
  backgroundColor: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
});

const StatValue = styled('div', {
  fontSize: '$3xl',
  fontWeight: '$bold',
  color: '$accent',
  marginBottom: '$2',
});

const StatLabel = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

interface EventData {
  id: string;
  timestamp: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  source: string;
  duration: number;
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);

  useEffect(() => {
    const mockEvents: EventData[] = Array.from({ length: 50 }, (_, i) => ({
      id: `event-${i}`,
      timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      type: ['login', 'logout', 'api_call', 'error', 'warning'][Math.floor(Math.random() * 5)],
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as EventData['severity'],
      message: `Event message ${i}`,
      source: ['web', 'mobile', 'api', 'system'][Math.floor(Math.random() * 4)],
      duration: Math.floor(Math.random() * 5000),
    }));

    setEvents(mockEvents);

    const timeSeriesData: TimeSeriesData[] = [
      {
        id: 'events',
        label: 'Events per Hour',
        color: '#00D1FF',
        type: 'area',
        data: Array.from({ length: 24 }, (_, i) => ({
          timestamp: Date.now() - (24 - i) * 60 * 60 * 1000,
          value: Math.floor(Math.random() * 100) + 50,
        })),
      },
      {
        id: 'errors',
        label: 'Errors',
        color: '#FF6B6B',
        type: 'line',
        data: Array.from({ length: 24 }, (_, i) => ({
          timestamp: Date.now() - (24 - i) * 60 * 60 * 1000,
          value: Math.floor(Math.random() * 20),
        })),
      },
    ];

    setChartData(timeSeriesData);
  }, []);

  const columns: Column<EventData>[] = [
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      render: (value) => new Date(value).toLocaleString(),
      width: '180px',
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      width: '120px',
    },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (value) => {
        const variants = {
          low: 'info',
          medium: 'warning',
          high: 'warning',
          critical: 'danger',
        };
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: value === 'critical' ? 'rgba(255, 107, 107, 0.15)' :
                           value === 'high' ? 'rgba(255, 181, 71, 0.15)' :
                           value === 'medium' ? 'rgba(255, 181, 71, 0.15)' :
                           'rgba(0, 209, 255, 0.15)',
            color: value === 'critical' ? '#FF6B6B' :
                   value === 'high' ? '#FFB547' :
                   value === 'medium' ? '#FFB547' :
                   '#00D1FF',
          }}>
            {value.toUpperCase()}
          </span>
        );
      },
      width: '100px',
    },
    {
      key: 'message',
      label: 'Message',
      sortable: false,
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      width: '100px',
    },
    {
      key: 'duration',
      label: 'Duration (ms)',
      sortable: true,
      numeric: true,
      render: (value) => value.toLocaleString(),
      width: '120px',
    },
  ];

  const stats = DataProcessor.calculateStats(
    events.map(e => ({ timestamp: e.timestamp, value: e.duration }))
  );

  return (
    <DashboardContainer>
      <SectionTitle>Analytics Dashboard</SectionTitle>

      <StatsGrid>
        <StatCard>
          <StatValue>{events.length}</StatValue>
          <StatLabel>Total Events</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{Math.round(stats.mean)}ms</StatValue>
          <StatLabel>Avg Duration</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{events.filter(e => e.severity === 'critical').length}</StatValue>
          <StatLabel>Critical</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{Math.round(stats.max)}ms</StatValue>
          <StatLabel>Max Duration</StatLabel>
        </StatCard>
      </StatsGrid>

      <DashboardGrid>
        <ChartSection>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#E8EEF2', marginBottom: '24px' }}>
            Event Trends (24h)
          </h3>
          <div style={{ height: '300px' }}>
            <LineChart data={chartData} />
          </div>
        </ChartSection>

        <TableSection>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#E8EEF2', marginBottom: '16px' }}>
            Recent Events
          </h3>
          <DataTable
            columns={columns}
            data={events}
            keyField="id"
            pageSize={10}
            searchable
            exportable
            selectable
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </TableSection>
      </DashboardGrid>
    </DashboardContainer>
  );
}