'use client';

import AutoRefresh from '@/components/AutoRefresh';
import { MonitorCard } from '@/components/MonitorCard';
import IncidentMarkdownAlert from '@/components/alerts/IncidentMarkdown';
import MaintenanceAlert from '@/components/alerts/Maintenance';
import SystemStatusAlert from '@/components/alerts/SystemStatus';
import { useNodeSearch } from '@/components/context/NodeSearchContext';
import { MonitorCardSkeleton } from '@/components/ui/CommonSkeleton';
import {
  revalidateData,
  useConfig,
  useMaintenanceData,
  useMonitorData,
} from '@/components/utils/swr';
import { Button, Chip, Tooltip } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, LayoutList, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const GLOBAL_VIEW_PREFERENCE_KEY = 'view-preference';

export default function Home() {
  const {
    monitorGroups,
    monitoringData,
    isLoading: isLoadingMonitors,
    revalidate: revalidateMonitors,
  } = useMonitorData();
  const { config: globalConfig, isLoading: isLoadingConfig } = useConfig();
  const { maintenanceList, isLoading: isLoadingMaintenance } = useMaintenanceData();
  const [isGlobalLiteView, setIsGlobalLiteView] = useState(false);
  const { searchTerm, isFiltering, clearSearch, searchTime } = useNodeSearch();

  const t = useTranslations();
  const viewT = useTranslations('view');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem(GLOBAL_VIEW_PREFERENCE_KEY);
      if (savedPreference === 'lite') {
        setIsGlobalLiteView(true);
      }
    }
  }, []);

  const isLoading = isLoadingMonitors || isLoadingConfig || isLoadingMaintenance;

  // Filter active maintenance plans
  const activeMaintenances = maintenanceList.filter(
    (m) => m.active && (m.status === 'under-maintenance' || m.status === 'scheduled'),
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GLOBAL_VIEW_PREFERENCE_KEY, isGlobalLiteView ? 'lite' : 'full');
    }
  }, [isGlobalLiteView]);

  const handleRefresh = async () => {
    await revalidateData();
  };

  const toggleGlobalView = () => {
    setIsGlobalLiteView((prev) => !prev);
  };

  const filteredMonitorGroups = useMemo(() => {
    if (!isFiltering) return monitorGroups;

    const searchTermLower = searchTerm.toLowerCase();

    return monitorGroups
      .map((group) => {
        const filteredMonitors = group.monitorList.filter((monitor) => {
          return (
            monitor.name.toLowerCase().includes(searchTermLower) ||
            monitor.url?.toLowerCase().includes(searchTermLower) ||
            monitor.tags?.some(
              (tag) =>
                tag.name.toLowerCase().includes(searchTermLower) ||
                tag.value?.toLowerCase().includes(searchTermLower),
            )
          );
        });

        if (filteredMonitors.length === 0) return null;

        return {
          ...group,
          monitorList: filteredMonitors,
        };
      })
      .filter(Boolean) as typeof monitorGroups;
  }, [monitorGroups, searchTerm, isFiltering]);

  const matchedMonitorsCount = useMemo(() => {
    if (!isFiltering) return 0;

    return filteredMonitorGroups.reduce((total, group) => {
      return total + group.monitorList.length;
    }, 0);
  }, [filteredMonitorGroups, isFiltering]);

  return (
    <>
      <AutoRefresh onRefresh={handleRefresh} interval={60000}>
        <div className="mx-auto max-w-screen-2xl px-4 py-8 pt-4">
          {/* 状态总览 */}
          <div className="flex justify-between items-center mb-6" suppressHydrationWarning={true}>
            <SystemStatusAlert />
            <Tooltip
              content={isGlobalLiteView ? viewT('switchToFull') : viewT('switchToLite')}
              suppressHydrationWarning={true}
            >
              <Button
                isIconOnly
                variant="light"
                onClick={toggleGlobalView}
                className="ml-2"
                aria-label={isGlobalLiteView ? viewT('switchToFull') : viewT('switchToLite')}
                suppressHydrationWarning={true}
              >
                {isGlobalLiteView ? <LayoutGrid size={20} /> : <LayoutList size={20} />}
              </Button>
            </Tooltip>
          </div>

          {/* 维护计划显示 */}
          {activeMaintenances.map((maintenance) => (
            <MaintenanceAlert key={maintenance.id} maintenance={maintenance} />
          ))}

          {/* 公告显示 */}
          {globalConfig?.incident && <IncidentMarkdownAlert incident={globalConfig.incident} />}

          {/* 搜索筛选提示 */}
          <AnimatePresence>
            {isFiltering && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-default-50 p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Search size={16} className="text-default-500" />
                  <span className="text-sm">
                    {t('node.filterResults', { count: matchedMonitorsCount })}
                  </span>
                  <Chip size="sm" variant="flat" color="primary" className="ml-2">
                    {searchTerm}
                  </Chip>
                  <span className="text-xs text-default-400 ml-2">
                    {t('node.searchTime', { time: searchTime })}
                  </span>
                </div>
                <Button size="sm" variant="light" onClick={clearSearch}>
                  {t('node.clearFilter')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

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
          ) : filteredMonitorGroups.length === 0 && isFiltering ? (
            // 无匹配结果
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-default-500 text-lg">{t('node.noMatchingResults')}</p>
              <Button color="primary" variant="flat" className="mt-4" onClick={clearSearch}>
                {t('node.clearFilter')}
              </Button>
            </motion.div>
          ) : (
            // 显示过滤后的监控组和监控项
            <AnimatePresence mode="wait">
              <motion.div
                key={searchTerm} // 搜索词变化时触发动画
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredMonitorGroups.map((group) => (
                  <div key={group.id} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {group.monitorList.map((monitor) => (
                          <motion.div
                            key={monitor.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MonitorCard
                              monitor={monitor}
                              heartbeats={monitoringData.heartbeatList[monitor.id] || []}
                              uptime24h={monitoringData.uptimeList[`${monitor.id}_24`] || 0}
                              isHome={true}
                              isLiteView={isGlobalLiteView}
                              disableViewToggle={true}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </AutoRefresh>
    </>
  );
}
