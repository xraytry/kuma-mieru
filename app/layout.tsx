import '@/styles/globals.css';
import { clsx } from 'clsx';
import type { Metadata, Viewport } from 'next';

import { Footer } from '@/components/Footer';
import Analytics from '@/components/basic/google-analytics';
import { Navbar } from '@/components/basic/navbar';
import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { getGlobalConfig } from '@/services/config.server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from './providers';

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await getGlobalConfig();

  return {
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
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
  const locale = await getLocale();
  const messages = await getMessages();

  const { config } = await getGlobalConfig();
  const { theme, googleAnalyticsId } = config;

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body className={clsx('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        {googleAnalyticsId && <Analytics id={googleAnalyticsId} />}
        <NextIntlClientProvider messages={messages}>
          <Providers themeProps={{ attribute: 'class', defaultTheme: theme }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">{children}</main>
              <Footer config={config} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
