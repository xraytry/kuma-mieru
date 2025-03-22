'use client';

import type { GlobalConfig } from '@/types/config';
import { useEffect, useState } from 'react';

async function fetchSourceConfig(): Promise<GlobalConfig> {
  const response = await fetch('/api/config');
  if (!response.ok) {
    throw new Error('获取源站配置失败');
  }
  return response.json();
}

export function useSourceConfig() {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSourceConfig()
      .then(setConfig)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return {
    data: config,
    error,
    isLoading,
  };
}
