/**
 * Dashboard Page
 * Main dashboard with realtime events
 */

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { styled } from '@/styles/design-tokens';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, slideUpVariants } from '@/utils/motionPresets';
import Topbar from '@/components/ui/Topbar';
import Sidebar from '@/components/ui/Sidebar';
import EventTile from '@/components/EventTile';

const DashboardContainer = styled('div', {
  minHeight: '100vh',
  backgroundColor: '$bg',
});

const DashboardLayout = styled('div', {
  display: 'flex',
});

const MainContent = styled('main', {
  flex: 1,
  p: '$8',
  
  '@media (max-width: 1024px)': {
    p: '$6',
  },
  
  '@media (max-width: 768px)': {
    p: '$4',
  },
});

const PageHeader = styled('div', {
  mb: '$8',
});

const PageTitle = styled('h1', {
  fontSize: '$4xl',
  fontWeight: '$bold',
  color: '$text',
  mb: '$2',
  
  '@media (max-width: 768px)': {
    fontSize: '$3xl',
  },
});

const PageSubtitle = styled('p', {
  fontSize: '$base',
  color: '$textMuted',
});

const StatsGrid = styled(motion.div, {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '$4',
  mb: '$8',
});

const StatCard = styled(motion.div, {
  p: '$5',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(6px)',
  border: '1px solid $border',
  borderRadius: '$lg',
  
  '& h3': {
    fontSize: '$xs',
    fontWeight: '$semibold',
    color: '$textMuted',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    mb: '$2',
  },
  
  '& p': {
    fontSize: '$3xl',
    fontWeight: '$bold',
    color: '$text',
  },
});

const SectionHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: '$4',
});

const SectionTitle = styled('h2', {
  fontSize: '$2xl',
  fontWeight: '$semibold',
  color: '$text',
});

const RefreshButton = styled(motion.button, {
  px: '$4',
  py: '$2',
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$accent',
  backgroundColor: 'rgba(0, 209, 255, 0.1)',
  border: '1px solid $borderAccent',
  borderRadius: '$md',
  cursor: 'pointer',
  transition: 'all $fast',
  
  '&:hover': {
    backgroundColor: 'rgba(0, 209, 255, 0.2)',
  },
});

const EventsGrid = styled(motion.div, {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '$4',
});

const EmptyState = styled('div', {
  textAlign: 'center',
  py: '$12',
  color: '$textMuted',
  
  '& svg': {
    fontSize: '$5xl',
    mb: '$4',
  },
});

interface Event {
  id: string;
  type: string;
  level: string;
  message?: string | null;
  source?: string | null;
  createdAt: string;
  metadata?: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?limit=12');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        
        // Calculate stats
        const critical = data.events.filter((e: Event) => e.level === 'critical').length;
        const warning = data.events.filter((e: Event) => e.level === 'warning').length;
        setStats({
          total: data.events.length,
          critical,
          warning,
        });
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchEvents();
      
      // Poll for new events every 10 seconds
      const interval = setInterval(fetchEvents, 10000);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <DashboardContainer>
        <Topbar />
        <div style={{ padding: '40px', textAlign: 'center', color: '#9AA4B2' }}>
          Loading dashboard...
        </div>
      </DashboardContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <DashboardContainer>
      <Topbar />
      <DashboardLayout>
        <Sidebar />
        <MainContent>
          <PageHeader>
            <PageTitle>Dashboard</PageTitle>
            <PageSubtitle>
              Welcome back, {session?.user?.name || session?.user?.email}
            </PageSubtitle>
          </PageHeader>

          <StatsGrid
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <StatCard variants={slideUpVariants}>
              <h3>Total Events</h3>
              <p>{stats.total}</p>
            </StatCard>
            <StatCard variants={slideUpVariants}>
              <h3>Critical</h3>
              <p style={{ color: '#FF6B6B' }}>{stats.critical}</p>
            </StatCard>
            <StatCard variants={slideUpVariants}>
              <h3>Warnings</h3>
              <p style={{ color: '#FFB547' }}>{stats.warning}</p>
            </StatCard>
          </StatsGrid>

          <SectionHeader>
            <SectionTitle>Recent Events</SectionTitle>
            <RefreshButton
              onClick={fetchEvents}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Refresh
            </RefreshButton>
          </SectionHeader>

          {events.length > 0 ? (
            <EventsGrid
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <AnimatePresence mode="popLayout">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={slideUpVariants}
                    layout
                  >
                    <EventTile event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </EventsGrid>
          ) : (
            <EmptyState>
              <div>📭</div>
              <p>No events yet</p>
            </EmptyState>
          )}
        </MainContent>
      </DashboardLayout>
    </DashboardContainer>
  );
}
