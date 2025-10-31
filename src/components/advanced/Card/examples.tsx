import { Card } from './Card';
import { styled } from '@/styles/design-tokens';

const Title = styled('h3', {
  fontSize: '$xl',
  fontWeight: '$semibold',
  color: '$text',
  margin: 0,
});

const Description = styled('p', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: '$relaxed',
  margin: 0,
});

const Badge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  px: '$2',
  py: '4px',
  fontSize: '$xs',
  fontWeight: '$semibold',
  borderRadius: '$sm',
  backgroundColor: '$accent',
  color: '$bg',
});

const Button = styled('button', {
  px: '$4',
  py: '$2',
  fontSize: '$sm',
  fontWeight: '$medium',
  borderRadius: '$md',
  border: '1px solid $border',
  backgroundColor: 'transparent',
  color: '$text',
  cursor: 'pointer',
  transition: 'all $fast',
  
  '&:hover': {
    backgroundColor: '$bgElevated',
    borderColor: '$accent',
  },
});

// Example 1: Basic Card
export function BasicCard() {
  return (
    <Card.Root>
      <Card.Header>
        <Title>System Status</Title>
      </Card.Header>
      <Card.Body>
        <Description>All systems operational</Description>
      </Card.Body>
    </Card.Root>
  );
}

// Example 2: Interactive Card dengan 3D effect
export function InteractiveCard() {
  return (
    <Card.Root
      variant="elevated"
      interactive
      blur
      onClick={() => console.log('Card clicked')}
    >
      <Card.Header action={<Badge>New</Badge>}>
        <Title>Security Alert</Title>
      </Card.Header>
      <Card.Body>
        <Description>
          Failed login attempt detected from unknown IP address.
          Immediate action required.
        </Description>
      </Card.Body>
      <Card.Footer>
        <Card.Actions>
          <Button>Dismiss</Button>
          <Button>View Details</Button>
        </Card.Actions>
      </Card.Footer>
    </Card.Root>
  );
}

// Example 3: Scrollable Card
export function ScrollableCard() {
  const logs = Array.from({ length: 50 }, (_, i) => `Log entry ${i + 1}`);
  
  return (
    <Card.Root variant="outlined" size="lg">
      <Card.Header>
        <Title>System Logs</Title>
      </Card.Header>
      <Card.Body scrollable maxHeight={300}>
        {logs.map((log, index) => (
          <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {log}
          </div>
        ))}
      </Card.Body>
      <Card.Footer justify="end">
        <Button>Export Logs</Button>
      </Card.Footer>
    </Card.Root>
  );
}

// Example 4: Complex composition
export function DashboardCard() {
  return (
    <Card.Root variant="default" blur interactive elevation={2}>
      <Card.Header action={
        <Badge>Live</Badge>
      }>
        <Title>Real-time Metrics</Title>
      </Card.Header>
      
      <Card.Body>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <MetricItem label="CPU" value="45%" status="good" />
          <MetricItem label="Memory" value="67%" status="warning" />
          <MetricItem label="Disk" value="23%" status="good" />
          <MetricItem label="Network" value="89%" status="critical" />
        </div>
      </Card.Body>
      
      <Card.Footer>
        <span style={{ fontSize: '12px', color: '#9AA4B2' }}>
          Last updated: 2 seconds ago
        </span>
        <Card.Actions spacing={3}>
          <Button>Refresh</Button>
          <Button>Details</Button>
        </Card.Actions>
      </Card.Footer>
    </Card.Root>
  );
}

// Helper component for metrics
function MetricItem({ label, value, status }: { label: string; value: string; status: 'good' | 'warning' | 'critical' }) {
  const colors = {
    good: '#2EE6A6',
    warning: '#FFB547',
    critical: '#FF6B6B',
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontSize: '12px', color: '#9AA4B2' }}>{label}</span>
      <span style={{ fontSize: '24px', fontWeight: 600, color: colors[status] }}>{value}</span>
    </div>
  );
}