/**
 * EventTile Component
 * Displays individual event with level-based styling
 */

'use client';

import { styled } from '@/styles/design-tokens';
import { motion } from 'framer-motion';
import { cardHoverVariants } from '@/utils/motionPresets';

const TileContainer = styled(motion.div, {
  p: '$4',
  borderRadius: '$lg',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(6px)',
  border: '1px solid $border',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  transition: 'all $fast',
  cursor: 'pointer',
  
  '&:hover': {
    borderColor: '$borderAccent',
    boxShadow: '$glow',
  },
});

const TileHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',
});

const TileTitle = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  flex: 1,
});

const TypeBadge = styled('span', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  px: '$2',
  py: '4px',
  borderRadius: '$sm',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  
  variants: {
    type: {
      security_alert: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        color: '$danger',
        border: '1px solid rgba(255, 107, 107, 0.3)',
      },
      system_status: {
        backgroundColor: 'rgba(91, 156, 255, 0.15)',
        color: '$info',
        border: '1px solid rgba(91, 156, 255, 0.3)',
      },
      user_action: {
        backgroundColor: 'rgba(46, 230, 166, 0.15)',
        color: '$success',
        border: '1px solid rgba(46, 230, 166, 0.3)',
      },
      api_call: {
        backgroundColor: 'rgba(155, 89, 255, 0.15)',
        color: '$accent2',
        border: '1px solid rgba(155, 89, 255, 0.3)',
      },
    },
  },
});

const LevelIndicator = styled('div', {
  size: '8px',
  borderRadius: '$full',
  
  variants: {
    level: {
      info: {
        backgroundColor: '$info',
        boxShadow: '0 0 8px $info',
      },
      warning: {
        backgroundColor: '$warning',
        boxShadow: '0 0 8px $warning',
      },
      error: {
        backgroundColor: '$danger',
        boxShadow: '0 0 8px $danger',
      },
      critical: {
        backgroundColor: '$danger',
        boxShadow: '0 0 12px $danger',
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
});

const TileMessage = styled('p', {
  fontSize: '$sm',
  color: '$text',
  lineHeight: '$relaxed',
  m: 0,
});

const TileFooter = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '$xs',
  color: '$textDim',
});

const MetadataItem = styled('span', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
});

interface Event {
  id: string;
  type: string;
  level: string;
  message?: string | null;
  source?: string | null;
  createdAt: Date | string;
  metadata?: string | null;
}

interface EventTileProps {
  event: Event;
  onClick?: () => void;
}

export default function EventTile({ event, onClick }: EventTileProps) {
  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      security_alert: '🚨',
      system_status: '📊',
      user_action: '👤',
      api_call: '🔌',
    };
    return icons[type] || '📝';
  };

  return (
    <TileContainer
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      layout
    >
      <TileHeader>
        <TileTitle>
          <span style={{ fontSize: '20px' }}>{getTypeIcon(event.type)}</span>
          <TypeBadge type={event.type as any}>
            {event.type.replace('_', ' ')}
          </TypeBadge>
        </TileTitle>
        <LevelIndicator level={event.level as any} />
      </TileHeader>
      
      <TileMessage>
        {event.message || 'No message provided'}
      </TileMessage>
      
      <TileFooter>
        <MetadataItem>
          <span>🌐</span>
          {event.source || 'Unknown'}
        </MetadataItem>
        <MetadataItem>
          <span>🕐</span>
          {formatTime(event.createdAt)}
        </MetadataItem>
      </TileFooter>
    </TileContainer>
  );
}
