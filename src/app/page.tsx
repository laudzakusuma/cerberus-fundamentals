/**
 * Landing Page
 * Home page with 3D hero and introduction to Cerberus
 */

'use client';

import dynamic from 'next/dynamic';
import { styled } from '@/styles/design-tokens';
import { motion } from 'framer-motion';
import { slideUpVariants, staggerContainer, fadeVariants } from '@/utils/motionPresets';
import Topbar from '@/components/ui/Topbar';
import Link from 'next/link';

// Dynamic import for 3D scene to avoid SSR issues
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading 3D scene...</div>,
});

const PageContainer = styled('div', {
  minHeight: '100vh',
  backgroundColor: '$bg',
});

const HeroSection = styled('section', {
  position: 'relative',
  height: 'calc(100vh - 70px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  
  '&::before': {
    content: '',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(0, 209, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
});

const HeroContent = styled(motion.div, {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '800px',
  px: '$6',
  
  '@media (max-width: 768px)': {
    px: '$4',
  },
});

const HeroTitle = styled(motion.h1, {
  fontSize: '$5xl',
  fontWeight: '$bold',
  lineHeight: '$tight',
  mb: '$4',
  background: 'linear-gradient(135deg, $text 0%, $accent 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  
  '@media (max-width: 768px)': {
    fontSize: '$3xl',
  },
});

const HeroSubtitle = styled(motion.p, {
  fontSize: '$xl',
  color: '$textMuted',
  lineHeight: '$relaxed',
  mb: '$8',
  
  '@media (max-width: 768px)': {
    fontSize: '$base',
    mb: '$6',
  },
});

const CTAButton = styled(motion.a, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '$2',
  px: '$8',
  py: '$4',
  fontSize: '$lg',
  fontWeight: '$semibold',
  background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
  color: '$bg',
  borderRadius: '$lg',
  cursor: 'pointer',
  transition: 'all $fast',
  boxShadow: '$glow',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 209, 255, 0.4)',
  },
});

const SceneWrapper = styled('div', {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  opacity: 0.6,
});

const FeaturesSection = styled('section', {
  py: '$20',
  px: '$6',
  
  '@media (max-width: 768px)': {
    py: '$12',
    px: '$4',
  },
});

const FeaturesGrid = styled(motion.div, {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '$6',
});

const FeatureCard = styled(motion.div, {
  p: '$6',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(6px)',
  border: '1px solid $border',
  borderRadius: '$lg',
  transition: 'all $fast',
  
  '&:hover': {
    borderColor: '$borderAccent',
    transform: 'translateY(-4px)',
    boxShadow: '$glow',
  },
});

const FeatureIcon = styled('div', {
  fontSize: '$4xl',
  mb: '$4',
});

const FeatureTitle = styled('h3', {
  fontSize: '$xl',
  fontWeight: '$semibold',
  color: '$text',
  mb: '$2',
});

const FeatureDescription = styled('p', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: '$relaxed',
});

const features = [
  {
    icon: '🛡️',
    title: 'Real-time Monitoring',
    description: 'Monitor security events as they happen with live updates and instant notifications.',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Gain insights from comprehensive analytics and customizable dashboards.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security protocols to protect your data.',
  },
];

export default function HomePage() {
  return (
    <PageContainer>
      <Topbar />
      
      <HeroSection>
        <SceneWrapper>
          <HeroScene />
        </SceneWrapper>
        
        <HeroContent
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <HeroTitle variants={slideUpVariants}>
            Security Monitoring
            <br />
            Reimagined
          </HeroTitle>
          
          <HeroSubtitle variants={slideUpVariants}>
            Meet Cerberus: Your guardian in the digital realm.
            Advanced threat detection with a stunning interface.
          </HeroSubtitle>
          
          <motion.div variants={fadeVariants}>
            <Link href="/auth/signin">
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <span>→</span>
              </CTAButton>
            </Link>
          </motion.div>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesGrid
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={slideUpVariants}
              whileHover={{ y: -4 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </PageContainer>
  );
}
