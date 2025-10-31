/**
 * Sidebar Component
 * Dashboard navigation with glass morphism effect
 */

'use client';

import { styled } from '@/styles/design-tokens';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { slideUpVariants, staggerContainer } from '@/utils/motionPresets';

const SidebarContainer = styled(motion.aside, {
  width: '260px',
  height: 'calc(100vh - 70px)',
  position: 'sticky',
  top: '70px',
  left: 0,
  p: '$4',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(12px)',
  borderRight: '1px solid $border',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  overflowY: 'auto',
  
  '@media (max-width: 1024px)': {
    position: 'fixed',
    left: 0,
    top: '60px',
    height: 'calc(100vh - 60px)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    zIndex: '$fixed',
    
    '&[data-open="true"]': {
      transform: 'translateX(0)',
    },
  },
});

const NavSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const SectionTitle = styled('h3', {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textDim',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  mb: '$2',
  px: '$3',
});

const NavItem = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  px: '$3',
  py: '$2',
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textMuted',
  borderRadius: '$md',
  transition: 'all $fast',
  position: 'relative',
  
  '&:hover': {
    color: '$text',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  '&[data-active="true"]': {
    color: '$accent',
    backgroundColor: 'rgba(0, 209, 255, 0.1)',
    
    '&::before': {
      content: '',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '3px',
      height: '60%',
      backgroundColor: '$accent',
      borderRadius: '0 2px 2px 0',
    },
  },
});

const IconWrapper = styled('span', {
  fontSize: '$lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Badge = styled('span', {
  ml: 'auto',
  px: '$2',
  py: '2px',
  fontSize: '$xs',
  fontWeight: '$semibold',
  backgroundColor: '$accent2',
  color: '$text',
  borderRadius: '$sm',
});

interface NavItemData {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const navigationItems: NavItemData[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'Events', href: '/dashboard/events', icon: '🔔', badge: 3 },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { label: 'Security', href: '/dashboard/security', icon: '🔒' },
];

const settingsItems: NavItemData[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  { label: 'API Keys', href: '/dashboard/api', icon: '🔑' },
  { label: 'Documentation', href: '/docs', icon: '📖' },
];

interface SidebarProps {
  isOpen?: boolean;
}

export default function Sidebar({ isOpen = false }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarContainer
      data-open={isOpen}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <NavSection>
        <SectionTitle>Main</SectionTitle>
        {navigationItems.map((item) => (
          <motion.div key={item.href} variants={slideUpVariants}>
            <NavItem
              href={item.href}
              data-active={isActive(item.href)}
            >
              <IconWrapper>{item.icon}</IconWrapper>
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge>{item.badge}</Badge>
              )}
            </NavItem>
          </motion.div>
        ))}
      </NavSection>
      
      <NavSection>
        <SectionTitle>System</SectionTitle>
        {settingsItems.map((item) => (
          <motion.div key={item.href} variants={slideUpVariants}>
            <NavItem
              href={item.href}
              data-active={isActive(item.href)}
            >
              <IconWrapper>{item.icon}</IconWrapper>
              {item.label}
            </NavItem>
          </motion.div>
        ))}
      </NavSection>
      
      {/* Status indicator */}
      <motion.div
        variants={slideUpVariants}
        style={{
          marginTop: 'auto',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(46, 230, 166, 0.1)',
          border: '1px solid rgba(46, 230, 166, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#2EE6A6',
            boxShadow: '0 0 8px #2EE6A6',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#2EE6A6' }}>
            System Operational
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#9AA4B2', margin: 0 }}>
          All systems running normally
        </p>
      </motion.div>
    </SidebarContainer>
  );
}
