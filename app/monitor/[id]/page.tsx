'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { MonitorCard } from '@/components/MonitorCard';
import AutoRefresh from '@/components/AutoRefresh';
import type { Monitor, MonitoringData } from '@/types/monitor';
import { Card } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function MonitorDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [monitor, setMonitor] = useState<Monitor | null>(null);
  const [data, setData] = useState<MonitoringData>({ heartbeatList: {}, uptimeList: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!resolvedParams.id) return;

    try {
      const monitorResponse = await fetch(`/api/monitor/${resolvedParams.id}`);
      const monitorData = await monitorResponse.json();

      if (!monitorResponse.ok) {
        throw new Error(monitorData.error || '获取数据失败');
      }

      if (monitorData.monitor) {
        setMonitor(monitorData.monitor);
      }

      if (monitorData.data) {
        setData(monitorData.data);
      }

      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : '获取数据失败');
      console.error('获取数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex items-center justify-center min-h-screen"
      >
        <Card className="w-full max-w-4xl h-96 animate-pulse" />
      </motion.div>
    );
  }

  if (error || !monitor) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex flex-col items-center justify-center min-h-screen gap-4"
      >
        <p className="text-xl text-gray-500">{error || '未找到监控项'}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          返回上一页
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <AutoRefresh onRefresh={fetchData} interval={30000}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 返回监控列表
              </button>
            </motion.div>
            <MonitorCard
              monitor={monitor}
              heartbeats={data.heartbeatList[monitor.id] || []}
              uptime24h={data.uptimeList[`${monitor.id}_24`] || 0}
              isHome={false}
            />
          </div>
        </div>
      </AutoRefresh>
    </motion.div>
  );
} 