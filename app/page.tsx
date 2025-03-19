'use client';

import { useCallback, useEffect, useState } from 'react';
import { MonitorCard } from '@/components/MonitorCard';
import AutoRefresh from '@/components/AutoRefresh';
import AlertMarkdown from '@/components/ui/AlertMarkdown';
import type { MonitorGroup, MonitoringData } from '@/types/monitor';
import type { GlobalConfig } from '@/types/config';

export default function Home() {
  const [monitorGroups, setMonitorGroups] = useState<MonitorGroup[]>([]);
  const [data, setData] = useState<MonitoringData>({ heartbeatList: {}, uptimeList: {} });
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const monitorResponse = await fetch('/api/monitor');
      const monitorData = await monitorResponse.json();

      if (monitorData.monitorGroups) {
        setMonitorGroups(monitorData.monitorGroups);
      }

      if (monitorData.data) {
        setData(monitorData.data);
      }

      const configResponse = await fetch('/api/config');
      const configData = await configResponse.json();

      if (configData) {
        setGlobalConfig(configData);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('获取数据失败:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AutoRefresh onRefresh={fetchData} interval={30000}>
      <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-4">
        {/* 公告显示 */}
        {globalConfig?.incident && <AlertMarkdown incident={globalConfig.incident} />}

        {/* 监控组和监控项 */}
        {monitorGroups.map((group) => (
          <div key={group.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.monitorList.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  heartbeats={data.heartbeatList[monitor.id] || []}
                  uptime24h={data.uptimeList[`${monitor.id}_24`] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AutoRefresh>
  );
}
