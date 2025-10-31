/**
 * Sign In Page
 * Authentication page with credentials form
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { styled } from '@/styles/design-tokens';
import { motion } from 'framer-motion';
import { slideUpVariants, fadeVariants } from '@/utils/motionPresets';
import Link from 'next/link';

const PageContainer = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$bg',
  px: '$4',
  position: 'relative',
  
  '&::before': {
    content: '',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(155, 89, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
});

const FormCard = styled(motion.div, {
  width: '100%',
  maxWidth: '420px',
  p: '$8',
  backgroundColor: '$bgCard',
  backdropFilter: 'blur(12px)',
  border: '1px solid $border',
  borderRadius: '$lg',
  boxShadow: '$lg',
});

const Logo = styled('div', {
  textAlign: 'center',
  mb: '$8',
  
  '& h1': {
    fontSize: '$3xl',
    fontWeight: '$bold',
    background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    mb: '$2',
  },
  
  '& p': {
    fontSize: '$sm',
    color: '$textMuted',
  },
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$5',
});

const FormGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const Label = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$text',
});

const Input = styled('input', {
  px: '$4',
  py: '$3',
  fontSize: '$base',
  color: '$text',
  backgroundColor: '$bgElevated',
  border: '1px solid $border',
  borderRadius: '$md',
  transition: 'all $fast',
  
  '&:focus': {
    outline: 'none',
    borderColor: '$accent',
    boxShadow: '0 0 0 3px rgba(0, 209, 255, 0.1)',
  },
  
  '&::placeholder': {
    color: '$textDim',
  },
});

const Button = styled(motion.button, {
  px: '$6',
  py: '$3',
  fontSize: '$base',
  fontWeight: '$semibold',
  background: 'linear-gradient(135deg, $accent 0%, $accent2 100%)',
  color: '$bg',
  border: 'none',
  borderRadius: '$md',
  cursor: 'pointer',
  transition: 'all $fast',
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  '&:not(:disabled):hover': {
    transform: 'translateY(-2px)',
    boxShadow: '$glow',
  },
});

const ErrorMessage = styled(motion.div, {
  p: '$3',
  fontSize: '$sm',
  color: '$danger',
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  border: '1px solid rgba(255, 107, 107, 0.3)',
  borderRadius: '$md',
});

const DemoInfo = styled('div', {
  mt: '$6',
  p: '$4',
  fontSize: '$xs',
  color: '$textMuted',
  backgroundColor: 'rgba(0, 209, 255, 0.05)',
  border: '1px solid rgba(0, 209, 255, 0.2)',
  borderRadius: '$md',
  
  '& strong': {
    color: '$accent',
    display: 'block',
    mb: '$2',
  },
  
  '& code': {
    fontFamily: '$mono',
    fontSize: '$xs',
    color: '$text',
  },
});

const BackLink = styled(Link, {
  display: 'block',
  mt: '$4',
  textAlign: 'center',
  fontSize: '$sm',
  color: '$textMuted',
  transition: 'color $fast',
  
  '&:hover': {
    color: '$accent',
  },
});

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormCard
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <Logo>
          <motion.div variants={slideUpVariants}>
            <h1>🛡️ CERBERUS</h1>
            <p>Sign in to your account</p>
          </motion.div>
        </Logo>

        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="demo@cerberus.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </FormGroup>

          <Button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <DemoInfo>
          <strong>Demo Credentials</strong>
          <code>Email: demo@cerberus.dev</code>
          <br />
          <code>Password: demo123</code>
        </DemoInfo>

        <BackLink href="/">← Back to home</BackLink>
      </FormCard>
    </PageContainer>
  );
}