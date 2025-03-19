import React, { useMemo } from 'react';
import type { Heartbeat } from '@/types/monitor';
import { clsx } from 'clsx';
import { CustomTooltip } from '../ui/CustomTooltip';
import dayjs from 'dayjs';

interface StatusBlockIndicatorProps {
  heartbeats: Heartbeat[];
  className?: string;
}

const STATUS_COLORS = {
  online: {
    light: 'bg-success/80',
    dark: 'bg-success',
    text: '在线',
  },
  maintenance: {
    light: 'bg-warning/80',
    dark: 'bg-warning',
    text: '维护中',
  },
  offline: {
    light: 'bg-danger/80',
    dark: 'bg-danger',
    text: '离线',
  },
};

export function StatusBlockIndicator({ heartbeats, className }: StatusBlockIndicatorProps) {
  // 获取最近的 50 个心跳数据点
  const recentHeartbeats = heartbeats.slice(-50);

  // 计算延迟动态分布
  const pingStats = useMemo(() => {
    const onlinePings = recentHeartbeats
      .filter((hb) => hb.status === 1 && hb.ping)
      .map((hb) => hb.ping as number);

    if (onlinePings.length === 0) return null;

    const sorted = [...onlinePings].sort((a, b) => a - b);
    return {
      min: sorted[0],
      p25: sorted[Math.floor(sorted.length * 0.25)],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p75: sorted[Math.floor(sorted.length * 0.75)],
      max: sorted[sorted.length - 1],
    };
  }, [recentHeartbeats]);

  const getStatusColor = (heartbeat: Heartbeat) => {
    const { status, ping } = heartbeat;

    if (status !== 1) {
      return STATUS_COLORS.maintenance;
    }

    if (!ping || !pingStats) return STATUS_COLORS.online;

    if (ping <= pingStats.p25) return STATUS_COLORS.online;
    if (ping <= pingStats.p50) return STATUS_COLORS.online;
    if (ping <= pingStats.p75) return STATUS_COLORS.online;
    if (ping <= pingStats.max * 0.9) return STATUS_COLORS.online; // 接近peak
    return STATUS_COLORS.online; // 异常 peak
  };

  return (
    <div className={clsx(className, 'relative mt-4 flex flex-col gap-1')}>
      {/* 图例 */}
      <div className="absolute -top-6 right-0 flex items-center gap-3 text-tiny text-foreground/80 dark:text-foreground/60">
        {Object.entries(STATUS_COLORS).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={clsx('w-1.5 h-1.5 rounded-full', value.dark)} />
            <span>{value.text}</span>
          </div>
        ))}
      </div>

      {/* 状态块 */}
      <div className="flex gap-0.5 h-3 w-full rounded-sm overflow-hidden bg-default-100 dark:bg-default-50">
        {heartbeats.map((hb) => {
          const { light, dark } = getStatusColor(hb);
          return (
            <CustomTooltip
              key={hb.time}
              content={
                <div className="flex w-full items-center gap-x-2">
                  <div className="flex w-full flex-col gap-y-1">
                    <div className="flex w-full items-center gap-x-1 text-small">
                      <span
                        className={clsx(
                          'text-small font-medium',
                          hb.status === 1 ? 'text-success-600 dark:text-success-500' :
                          hb.status === 2 ? 'text-warning-600 dark:text-warning-500' :
                          'text-danger-600 dark:text-danger-500'
                        )}
                      >
                        {getStatusColor(hb).text}
                      </span>
                      <span className="text-foreground/60 dark:text-foreground/40">-</span>
                      <span className="text-foreground/60 dark:text-foreground/40">
                        {dayjs(hb.time).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                </div>
              }
            >
              <div
                className={clsx(
                  'flex-1 h-full cursor-pointer transition-all hover:opacity-80',
                  'dark:hover:opacity-90',
                  hb.ping ? dark : light
                )}
              />
            </CustomTooltip>
          );
        })}
      </div>
    </div>
  );
}
