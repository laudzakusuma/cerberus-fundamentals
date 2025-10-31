/**
 * Topbar Component
 * Main navigation bar with authentication status
 */

'use client';

import { styled } from '@/styles/design-tokens';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const TopbarContainer = styled(motion.header, {
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '$6',
  backgroundColor: 'rgba(11, 15, 20, 0.85)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid $border',
  zIndex: '$sticky',
  
  '@media (max-width: 768px)': {
    px: '$4',
    height: '60px',
  },
});

const Logo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  fontSize: '$xl',
  fontWeight: '$bold',
  color: '$text',
  
  '& span': {
    background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
});

const Nav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  gap: '$6',
  
  '@media (max-width: 768px)': {
    gap: '$3',
  },
});

const NavLink = styled(Link, {
  color: '$textMuted',
  fontSize: '$sm',
  fontWeight: '$medium',
  transition: 'color $fast',
  position: 'relative',
  
  '&:hover': {
    color: '$accent',
  },
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: '$accent',
    transform: 'scaleX(0)',
    transition: 'transform $fast',
  },
  
  '&:hover::after': {
    transform: 'scaleX(1)',
  },
});

const UserInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

const UserAvatar = styled('div', {
  size: '36px',
  borderRadius: '$full',
  background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$sm',
  fontWeight: '$bold',
  color: '$bg',
});

const Button = styled(motion.button, {
  px: '$4',
  py: '$2',
  fontSize: '$sm',
  fontWeight: '$medium',
  borderRadius: '$md',
  cursor: 'pointer',
  transition: 'all $fast',
  
  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
        color: '$bg',
        
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '$glow',
        },
      },
      ghost: {
        background: 'transparent',
        color: '$textMuted',
        border: '1px solid $border',
        
        '&:hover': {
          color: '$text',
          borderColor: '$accent',
        },
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
  },
});

const StatusDot = styled('span', {
  size: '8px',
  borderRadius: '$full',
  backgroundColor: '$success',
  boxShadow: '0 0 8px $success',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
});

export default function Topbar() {
  const { data: session, status } = useSession();
  
  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <TopbarContainer
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <Logo>
        <span>🛡️</span>
        <span>CERBERUS</span>
      </Logo>
      
      <Nav>
        {status === 'authenticated' ? (
          <>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/events">Events</NavLink>
            
            <UserInfo>
              <UserAvatar>
                {getInitials(session?.user?.name)}
              </UserAvatar>
              <span style={{ fontSize: '14px', color: '#9AA4B2' }}>
                {session?.user?.email}
              </span>
              <StatusDot />
            </UserInfo>
            
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: '/' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/auth/signin">
            <Button
              variant="primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </Button>
          </Link>
        )}
      </Nav>
    </TopbarContainer>
  );
}
