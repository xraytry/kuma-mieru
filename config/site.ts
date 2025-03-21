'use client';

import { apiConfig } from '@/config/api';

type GlobalConfig = {
  title?: string;
  description?: string;
  icon?: string | null;
};

const DEFAULT_CONFIG = {
  title: 'Kuma Mieru',
  description: 'A beautiful and modern uptime monitoring dashboard',
  icon: null, // 交给 navbar 组件处理
} as const;

const constructIconUrl = (iconPath: string | null | undefined): string | null => {
  if (!iconPath) return null;

  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }

  const cleanPath = iconPath.startsWith('/') ? iconPath.slice(1) : iconPath;
  return `${apiConfig.baseUrl}/${cleanPath}`;
};

const fetchConfig = async (): Promise<GlobalConfig> => {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const data = await response.json();
    return data.config || {};
  } catch (error) {
    console.error('Error fetching config:', error);
    return {};
  }
};

let siteConfig: ReturnType<typeof createSiteConfig>;

const createSiteConfig = (config: GlobalConfig = {}) =>
  ({
    name: config?.title || DEFAULT_CONFIG.title,
    description: config?.description || DEFAULT_CONFIG.description,
    icon: constructIconUrl(config?.icon) || constructIconUrl(DEFAULT_CONFIG.icon),
    navItems: [
      {
        label: '首页',
        href: '/',
        external: false,
      },
      {
        label: '编辑此页',
        href: `${apiConfig.baseUrl}/manage-status-page`,
        external: true,
      },
    ],
    navMenuItems: [
      {
        label: '首页',
        href: '/',
        external: false,
      },
      {
        label: '编辑此页',
        href: `${apiConfig.baseUrl}/manage-status-page`,
        external: true,
      },
    ],
    links: {
      github: 'https://github.com/Alice39s/kuma-mieru',
      docs: 'https://github.com/Alice39s/kuma-mieru/blob/main/README.md',
    },
  }) as const;

siteConfig = createSiteConfig();

export async function initializeSiteConfig() {
  const config = await fetchConfig();
  siteConfig = createSiteConfig(config);
  return siteConfig;
}

export { siteConfig };
export type SiteConfig = ReturnType<typeof createSiteConfig>;
