/**
 * Format latency value with appropriate unit
 * @param ms latency in milliseconds
 * @returns formatted string with unit
 */
export function formatLatency(ms: number): string {
  if (!ms && ms !== 0) return '-';

  if (ms < 200) {
    return `${ms.toFixed(0)} ms`;
  }

  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)} s`;
  }

  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(1);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format latency value for chart axis display
 * @param ms latency in milliseconds
 * @returns formatted string with unit, more compact than formatLatency
 */
export function formatLatencyForAxis(ms: number): string {
  if (ms <= 200) {
    return `${ms} ms`;
  }

  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }

  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(1);
  return `${minutes}m${seconds}s`;
}

/**
 * Get color based on latency value for UI display
 * @param ms latency in milliseconds
 * @returns color key for HeroUI components:
 * - "success" for < 100ms
 * - "warning" for 100ms-1000ms
 * - "danger" for > 1000ms or invalid values
 */
export function getLatencyColor(ms: number): "success" | "warning" | "danger" {
  if (!ms && ms !== 0) return "danger";
  if (ms < 200) return "success";
  if (ms < 1000) return "warning";
  return "danger";
}

/**
 * Convert a date string to a relative time string in Chinese
 * @param date ISO date string to convert
 * @returns relative time string in Chinese (e.g. "3 分钟前")
 */
export function timeAgo(date: string): string {
  const seconds = Math.floor((+new Date() - +new Date(date)) / 1000);

  const intervals: { [key: string]: number } = {
    年: 31536000,
    个月: 2592000,
    天: 86400,
    小时: 3600,
    分钟: 60,
    秒: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}前`;
    }
  }

  return '刚刚';
}
