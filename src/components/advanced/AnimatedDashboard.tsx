import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { styled } from '@/styles/design-tokens';
import { useOrchestration, useReducedMotion } from '@/animations/useOrchestration';
import { fadeVariants, listVariants } from '@/animations/variants';
import { Card } from '@/components/advanced/Card/Card';

const DashboardGrid = styled(motion.div, {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '$6',
  padding: '$8',
});

const MetricCard = styled(motion.div, {
  position: 'relative',
  overflow: 'hidden',
});

const MetricValue = styled(motion.div, {
  fontSize: '$5xl',
  fontWeight: '$bold',
  color: '$accent',
  lineHeight: 1,
  marginBottom: '$2',
});

const MetricLabel = styled('div', {
  fontSize: '$sm',
  color: '$textMuted',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const MetricTrend = styled(motion.div, {
  position: 'absolute',
  top: '$4',
  right: '$4',
  fontSize: '$xs',
  fontWeight: '$semibold',
  padding: '$1 $2',
  borderRadius: '$sm',
  
  variants: {
    trend: {
      up: {
        color: '$success',
        backgroundColor: 'rgba(46, 230, 166, 0.1)',
      },
      down: {
        color: '$danger',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
      },
      neutral: {
        color: '$textMuted',
        backgroundColor: 'rgba(154, 164, 178, 0.1)',
      },
    },
  },
});

const ChartContainer = styled(motion.div, {
  height: '200px',
  marginTop: '$4',
  position: 'relative',
});

interface MetricData {
  id: string;
  label: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  chartData?: number[];
}

const mockMetrics: MetricData[] = [
  { id: '1', label: 'Total Events', value: 12847, trend: 'up', trendValue: '+12.5%' },
  { id: '2', label: 'Critical Alerts', value: 23, trend: 'down', trendValue: '-8.2%' },
  { id: '3', label: 'System Uptime', value: 99.98, trend: 'neutral', trendValue: '0.0%' },
  { id: '4', label: 'Response Time', value: 145, trend: 'up', trendValue: '+5.3%' },
];

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return count;
}

export function AnimatedDashboard() {
  const reducedMotion = useReducedMotion();
  
  const metricControlsRef = useRef<ReturnType<typeof useAnimation>[]>([]);
  
  if (metricControlsRef.current.length === 0) {
    metricControlsRef.current = mockMetrics.map(() => useAnimation());
  }
  
  const headerControl = useAnimation();
  const gridControl = useAnimation();

  const orchestration = useOrchestration({
    steps: [
      {
        id: 'header',
        controls: headerControl,
        variants: 'animate',
        delay: 0,
      },
      {
        id: 'grid',
        controls: gridControl,
        variants: 'animate',
        delay: 0.2,
      },
      ...metricControlsRef.current.map((controls, index) => ({
        id: `metric-${index}`,
        controls,
        variants: 'animate',
        delay: 0,
      })),
    ],
    mode: 'stagger',
    staggerDelay: 0.1,
  });

  useEffect(() => {
    if (!reducedMotion) {
      orchestration.play();
    }
  }, [reducedMotion, orchestration]);

  return (
    <div>
      <motion.div
        initial="initial"
        animate={headerControl}
        variants={fadeVariants.down}
      >
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 600, 
          color: '#E8EEF2',
          marginBottom: '32px',
        }}>
          System Overview
        </h1>
      </motion.div>

      <DashboardGrid
        initial="initial"
        animate={gridControl}
        variants={listVariants}
      >
        {mockMetrics.map((metric, index) => (
          <AnimatedMetricCard
            key={metric.id}
            metric={metric}
            controls={metricControlsRef.current[index]}
            delay={index * 0.1}
          />
        ))}
      </DashboardGrid>
    </div>
  );
}

function AnimatedMetricCard({ 
  metric, 
  controls, 
  delay 
}: { 
  metric: MetricData; 
  controls: ReturnType<typeof useAnimation>; 
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const displayValue = useCountUp(metric.value, 2000);

  return (
    <Card.Root
      variant="elevated"
      blur
      interactive
      onHover={() => setIsHovered(true)}
    >
      <motion.div
        initial="initial"
        animate={controls}
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
              duration: 0.6,
              delay,
              ease: [0.0, 0.0, 0.2, 1],
            },
          },
        }}
      >
        <MetricCard
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MetricTrend 
            trend={metric.trend}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            {metric.trendValue}
          </MetricTrend>

          <MetricValue
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {displayValue.toLocaleString()}
          </MetricValue>

          <MetricLabel>{metric.label}</MetricLabel>

          <ChartContainer>
            <MiniSparkline data={metric.chartData} isHovered={isHovered} />
          </ChartContainer>
        </MetricCard>
      </motion.div>
    </Card.Root>
  );
}

function MiniSparkline({ data, isHovered }: { data?: number[]; isHovered: boolean }) {
  const points = data || Array.from({ length: 20 }, () => Math.random() * 100);
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;

  const normalizedPoints = points.map((p) => ((p - min) / range) * 100);
  
  const pathData = normalizedPoints
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - point;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00D1FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={`${pathData} L 100 100 L 0 100 Z`}
        fill="url(#sparklineGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        transition={{ duration: 0.3 }}
      />

      <motion.path
        d={pathData}
        fill="none"
        stroke="#00D1FF"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ 
          duration: 1.5, 
          ease: [0.0, 0.0, 0.2, 1],
          delay: 0.5,
        }}
      />

      {isHovered && (
        <motion.circle
          r="3"
          fill="#00D1FF"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            cx: normalizedPoints.map((_, i) => (i / (points.length - 1)) * 100),
            cy: normalizedPoints.map((p) => 100 - p),
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </svg>
  );
}