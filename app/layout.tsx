import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Link } from '@heroui/react';
import { clsx } from 'clsx';

import { Providers } from './providers';
import { getGlobalConfig } from '@/services/config';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/basic/navbar';
import { Footer } from '@/components/Footer';
import Analytics from '@/components/basic/google-analytics';

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getGlobalConfig();

  return {
    title: {
      default: config.title,
      template: `%s - ${config.title}`,
    },
    description: config.description,
    icons: {
      icon: config.icon,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config } = await getGlobalConfig();
  const { theme, googleAnalyticsId } = config;

  return (
    <html suppressHydrationWarning lang="zh-CN">
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        {googleAnalyticsId && <Analytics id={googleAnalyticsId} />}
        <Providers themeProps={{ attribute: 'class', defaultTheme: theme }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
              {children}
            </main>
            <Footer config={config} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
