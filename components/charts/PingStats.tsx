import React, { useMemo } from 'react';
import type { Heartbeat } from '@/types/monitor';
import { clsx } from 'clsx';
import { calculatePingMetrics, getPingColor } from '../utils/charts';
import { Tooltip } from '@heroui/react';

interface PingStatsProps {
  heartbeats: Heartbeat[];
  isHome?: boolean;
}

const PING_LABELS = {
  lt: {
    short: 'LT',
    full: '最新延迟',
  },
  av: {
    short: 'AVG',
    full: '平均延迟',
  },
  ta: {
    short: 'TA',
    full: '修剪后平均',
  },
} as const;

export function PingStats({ heartbeats, isHome = false }: PingStatsProps) {
  const stats = useMemo(() => calculatePingMetrics(heartbeats), [heartbeats]);

  if (!stats) return null;

  return (
    <div className="hidden sm:flex items-center gap-2 text-tiny text-foreground/80 dark:text-foreground/60">
      <div className="flex items-center gap-1">
        {isHome ? (
          <Tooltip content={PING_LABELS.lt.full}>
            <span>{PING_LABELS.lt.short}</span>
          </Tooltip>
        ) : (
          PING_LABELS.lt.full
        )}:
        <span className={clsx('font-medium', getPingColor(stats.latestPing))}>
          {stats.latestPing}ms
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHome ? (
          <Tooltip content={PING_LABELS.av.full}>
            <span>{PING_LABELS.av.short}</span>
          </Tooltip>
        ) : (
          PING_LABELS.av.full
        )}:
        <span className={clsx('font-medium', getPingColor(stats.avgPing))}>
          {stats.avgPing}ms
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHome ? (
          <Tooltip content={PING_LABELS.ta.full}>
            <span>{PING_LABELS.ta.short}</span>
          </Tooltip>
        ) : (
          PING_LABELS.ta.full
        )}:
        <span className={clsx('font-medium', getPingColor(stats.trimmedAvgPing))}>
          {stats.trimmedAvgPing}ms
        </span>
      </div>
    </div>
  );
} 