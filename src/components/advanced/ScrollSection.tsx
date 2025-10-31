import { motion } from 'framer-motion';
import { styled } from '@/styles/design-tokens';
import { useScrollAnimation } from '@/animations/useOrchestration';
import { fadeVariants } from '@/animations/variants';

const Section = styled('section', {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: '$8',
});

const Content = styled(motion.div, {
  maxWidth: '800px',
  width: '100%',
});

const Title = styled(motion.h2, {
  fontSize: '$4xl',
  fontWeight: '$bold',
  color: '$text',
  marginBottom: '$6',
});

const Description = styled(motion.p, {
  fontSize: '$lg',
  color: '$textMuted',
  lineHeight: '$relaxed',
  marginBottom: '$8',
});

const FeatureGrid = styled(motion.div, {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '$6',
});

const FeatureCard = styled(motion.div, {
  padding: '$6',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(12px)',
  border: '1px solid $border',
  borderRadius: '$lg',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    borderColor: '$accent',
    transform: 'translateY(-4px)',
  },
});

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '🛡️',
    title: 'Real-time Protection',
    description: 'Monitor your systems 24/7 with instant threat detection and response capabilities.',
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Gain deep insights with comprehensive data visualization and reporting tools.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description: 'Receive intelligent notifications based on severity and customizable rules.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Experience sub-millisecond response times with optimized infrastructure.',
  },
];

export function ScrollSection() {
  const { ref: titleRef, controls: titleControls } = useScrollAnimation(0.2);
  const { ref: descRef, controls: descControls } = useScrollAnimation(0.3);
  const { ref: gridRef, controls: gridControls } = useScrollAnimation(0.1);

  return (
    <Section>
      <Content>
        <Title
          ref={titleRef as any}
          initial="initial"
          animate={titleControls}
          variants={fadeVariants.up}
        >
          Built for Security Professionals
        </Title>

        <Description
          ref={descRef as any}
          initial="initial"
          animate={descControls}
          variants={fadeVariants.up}
        >
          Cerberus provides enterprise-grade security monitoring with an intuitive
          interface designed for both novice users and seasoned professionals.
        </Description>

        <FeatureGrid
          ref={gridRef as any}
          initial="initial"
          animate={gridControls}
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={{
                initial: { 
                  opacity: 0, 
                  y: 40,
                  scale: 0.9,
                },
                animate: { 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
              whileHover={{
                scale: 1.03,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#E8EEF2',
                marginBottom: '8px',
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#9AA4B2',
                lineHeight: '1.6',
              }}>
                {feature.description}
              </p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Content>
    </Section>
  );
}