'use client';

import generatedConfig from './generated-config.json';

const baseConfig = {
  name: 'Kuma Mieru',
  description: 'A beautiful and modern uptime monitoring dashboard',
  icon: '/favicon.ico',
} as const;

export const siteConfig = {
  name: generatedConfig.siteMeta.title || baseConfig.name,
  description: generatedConfig.siteMeta.description || baseConfig.description,
  icon: generatedConfig.siteMeta.icon
    ? generatedConfig.siteMeta.icon.startsWith('http')
      ? generatedConfig.siteMeta.icon
      : `${generatedConfig.baseUrl}/${generatedConfig.siteMeta.icon.replace(/^\//, '')}`
    : baseConfig.icon,
  navItems: [
    {
      label: 'pageMain',
      href: '/',
      external: false,
    },
    {
      label: 'pageEdit',
      href: `${generatedConfig.baseUrl}/manage-status-page`,
      external: true,
    },
  ],
  navMenuItems: [
    {
      label: 'pageMain',
      href: '/',
      external: false,
    },
    {
      label: 'pageEdit',
      href: `${generatedConfig.baseUrl}/manage-status-page`,
      external: true,
    },
  ],
  links: {
    github: 'https://github.com/Alice39s/kuma-mieru',
    docs: 'https://github.com/Alice39s/kuma-mieru/blob/main/README.md',
  },
} as const;

export type SiteConfig = typeof siteConfig;
