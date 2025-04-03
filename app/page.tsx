'use client';

import AlertMarkdown from '@/components/AlertMarkdown';
import AutoRefresh from '@/components/AutoRefresh';
import { MonitorCard } from '@/components/MonitorCard';
import { MonitorCardSkeleton } from '@/components/ui/CommonSkeleton';
import { useMonitorData, useConfig, revalidateData } from '@/components/utils/swr';

export default function Home() {
  const { monitorGroups, monitoringData, isLoading: isLoadingMonitors, revalidate: revalidateMonitors } = useMonitorData();
  const { config: globalConfig, isLoading: isLoadingConfig } = useConfig();
  
  const isLoading = isLoadingMonitors || isLoadingConfig;

  const handleRefresh = async () => {
    await revalidateData();
  };

  return (
    <AutoRefresh onRefresh={handleRefresh} interval={60000}>
      <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-4">
        {/* 公告显示 */}
        {globalConfig?.incident && <AlertMarkdown incident={globalConfig.incident} />}

        {/* 监控组和监控项 */}
        {isLoading ? (
          // 加载状态显示骨架屏
          <div className="space-y-8">
            {[1, 2].map((groupIndex) => (
              <div key={groupIndex}>
                <div className="h-8 w-48 bg-default-100 rounded-lg mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3].map((cardIndex) => (
                    <MonitorCardSkeleton key={cardIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 实际内容
          monitorGroups.map((group) => (
            <div key={group.id} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.monitorList.map((monitor) => (
                  <MonitorCard
                    key={monitor.id}
                    monitor={monitor}
                    heartbeats={monitoringData.heartbeatList[monitor.id] || []}
                    uptime24h={monitoringData.uptimeList[`${monitor.id}_24`] || 0}
                    isHome={true}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AutoRefresh>
  );
}
