import type { Heartbeat } from '@/types/monitor';

export const STATUS_COLORS = {
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
} as const;

export const getPingColor = (ping: number) => {
  if (ping <= 100) return 'text-success-600 dark:text-success-500'; // 优秀
  if (ping <= 200) return 'text-warning-600 dark:text-warning-500'; // 一般
  return 'text-danger-600 dark:text-danger-500'; // 较差
};

export const getStatusColor = (heartbeat: Heartbeat, pingStats: PingStats | null) => {
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

export interface PingStats {
  min: number;
  p25: number;
  p50: number;
  p75: number;
  max: number;
}

export interface PingMetrics {
  latestPing: number;
  avgPing: number;
  trimmedAvgPing: number;
}

export const calculatePingStats = (heartbeats: Heartbeat[]): PingStats | null => {
  const onlinePings = heartbeats
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
};

export const calculatePingMetrics = (heartbeats: Heartbeat[]): PingMetrics | null => {
  const onlinePings = heartbeats
    .filter((hb) => hb.status === 1 && hb.ping)
    .map((hb) => hb.ping as number);

  if (onlinePings.length === 0) return null;

  // 最新延迟
  const latestPing = heartbeats[heartbeats.length - 1]?.ping || 0;

  // 平均延迟
  const avgPing = Math.round(onlinePings.reduce((acc, curr) => acc + curr, 0) / onlinePings.length);

  // 去除峰值后的平均延迟（去除最高和最低的 10%）
  const sorted = [...onlinePings].sort((a, b) => a - b);
  const trimStart = Math.floor(sorted.length * 0.1);
  const trimEnd = Math.ceil(sorted.length * 0.9);
  const trimmedPings = sorted.slice(trimStart, trimEnd);
  const trimmedAvgPing = Math.round(
    trimmedPings.reduce((acc, curr) => acc + curr, 0) / trimmedPings.length
  );

  return {
    latestPing,
    avgPing,
    trimmedAvgPing,
  };
}; 