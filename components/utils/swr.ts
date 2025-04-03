import useSWR, { mutate } from 'swr';
import type { SWRConfiguration } from 'swr';
import type { Monitor, MonitorGroup, MonitoringData } from '@/types/monitor';
import type { GlobalConfig } from '@/types/config';

// Common fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success && url.includes('/api/monitor')) {
    throw new Error('Failed to fetch monitor data');
  }
  
  return data;
};

// Key constants for SWR cache
export const SWR_KEYS = {
  MONITOR: '/api/monitor',
  CONFIG: '/api/config',
};

// Type for monitor API response
interface MonitorResponse {
  success: boolean;
  monitorGroups: MonitorGroup[];
  data: MonitoringData;
}

/**
 * Hook to fetch all monitor data
 */
export function useMonitorData(config?: SWRConfiguration) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<MonitorResponse>(
    SWR_KEYS.MONITOR,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
      ...config,
    }
  );

  return {
    monitorGroups: data?.monitorGroups || [],
    monitoringData: data?.data || { heartbeatList: {}, uptimeList: {} },
    isLoading,
    isError: !!error,
    error,
    revalidate,
  };
}

/**
 * Hook to fetch a specific monitor by ID
 */
export function useMonitor(monitorId: number | string, config?: SWRConfiguration) {
  const numericId = typeof monitorId === 'string' ? Number.parseInt(monitorId, 10) : monitorId;
  
  const { data, error, isLoading, mutate: revalidate } = useSWR<MonitorResponse>(
    SWR_KEYS.MONITOR,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      ...config,
    }
  );

  // Find the specific monitor
  const monitor = data?.monitorGroups
    ?.flatMap(group => group.monitorList)
    .find(m => m.id === numericId);

  // Extract data for this specific monitor
  const monitoringData: MonitoringData = {
    heartbeatList: {
      [numericId]: data?.data?.heartbeatList[numericId] || [],
    },
    uptimeList: {
      [`${numericId}_24`]: data?.data?.uptimeList[`${numericId}_24`] || 0,
    },
  };

  return {
    monitor,
    monitoringData,
    isLoading,
    isError: !!error,
    error,
    revalidate,
  };
}

/**
 * Hook to fetch global configuration
 */
export function useConfig(config?: SWRConfiguration) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<GlobalConfig>(
    SWR_KEYS.CONFIG,
    fetcher,
    {
      revalidateOnFocus: true,
      ...config,
    }
  );

  return {
    config: data,
    isLoading,
    isError: !!error,
    error,
    revalidate,
  };
}

/**
 * Manually trigger revalidation for a specific key or all keys
 */
export function revalidateData(key?: string) {
  if (key) {
    return mutate(key);
  }
  
  // Revalidate all keys if no specific key provided
  return Promise.all([
    mutate(SWR_KEYS.MONITOR),
    mutate(SWR_KEYS.CONFIG),
  ]);
} 