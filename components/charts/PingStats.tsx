import React, { useMemo } from 'react';
import type { Heartbeat } from '@/types/monitor';
import { clsx } from 'clsx';
import { calculatePingMetrics } from '../utils/charts';
import { Tooltip } from '@heroui/react';
import { getPingColorClass } from '../utils/colors';
import { formatLatency } from '../utils/format';
import { useTranslations } from 'next-intl';

interface PingStatsProps {
  heartbeats: Heartbeat[];
  isHome?: boolean;
}

const PING_LABELS = {
  lt: {
    short: 'LT',
    full: 'nodeLatestPing',
  },
  av: {
    short: 'AVG',
    full: 'nodeAvgPing',
  },
  ta: {
    short: 'TA',
    full: 'nodeTrimmedAvgPing',
  },
} as const;

export function PingStats({ heartbeats, isHome = false }: PingStatsProps) {
  const t = useTranslations();
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
          t(PING_LABELS.lt.full)
        )}
        :
        <span className={clsx('font-medium', getPingColorClass(stats.latestPing).text)}>
          {formatLatency(stats.latestPing)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHome ? (
          <Tooltip content={PING_LABELS.av.full}>
            <span>{PING_LABELS.av.short}</span>
          </Tooltip>
        ) : (
          t(PING_LABELS.av.full)
        )}
        :
        <span className={clsx('font-medium', getPingColorClass(stats.avgPing).text)}>
          {formatLatency(stats.avgPing)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isHome ? (
          <Tooltip content={PING_LABELS.ta.full}>
            <span>{PING_LABELS.ta.short}</span>
          </Tooltip>
        ) : (
          t(PING_LABELS.ta.full)
        )}
        :
        <span className={clsx('font-medium', getPingColorClass(stats.trimmedAvgPing).text)}>
          {formatLatency(stats.trimmedAvgPing)}
        </span>
      </div>
    </div>
  );
}
