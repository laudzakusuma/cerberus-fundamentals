/**
 * Root Layout
 * Global layout with session provider and styling
 */

import type { Metadata } from 'next';
import { globalStyles } from '@/styles/design-tokens';
import '@/styles/global.css';
import Providers from './providers';

globalStyles();

export const metadata: Metadata = {
  title: 'Cerberus - Security Monitoring Platform',
  description: 'Advanced security monitoring and event management platform',
  manifest: '/manifest.json',
  themeColor: '#0B0F14',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-512.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
