'use client';

import { apiConfig } from '@/config/api';
import generatedConfig from './generated-config.json';

const DEFAULT_CONFIG = {
  title: 'Kuma Mieru',
  description: 'A beautiful and modern uptime monitoring dashboard',
  icon: '/favicon.ico',
} as const;

const constructIconUrl = (iconPath: string | null | undefined): string | null => {
  if (!iconPath) return null;

  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }

  const cleanPath = iconPath.startsWith('/') ? iconPath.slice(1) : iconPath;
  return `${apiConfig.baseUrl}/${cleanPath}`;
};

const createSiteConfig = () =>
  ({
    name: generatedConfig.siteMeta.title || DEFAULT_CONFIG.title,
    description: generatedConfig.siteMeta.description || DEFAULT_CONFIG.description,
    icon: constructIconUrl(generatedConfig.siteMeta.icon) || DEFAULT_CONFIG.icon,
    navItems: [
      {
        label: 'pageMain',
        href: '/',
        external: false,
      },
      {
        label: 'pageEdit',
        href: `${apiConfig.baseUrl}/manage-status-page`,
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
        href: `${apiConfig.baseUrl}/manage-status-page`,
        external: true,
      },
    ],
    links: {
      github: 'https://github.com/Alice39s/kuma-mieru',
      docs: 'https://github.com/Alice39s/kuma-mieru/blob/main/README.md',
    },
  }) as const;

export const siteConfig = createSiteConfig();
export type SiteConfig = ReturnType<typeof createSiteConfig>;
