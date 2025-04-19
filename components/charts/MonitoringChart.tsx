import type { Heartbeat } from '@/types/monitor';
import { Tab, Tabs } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from '../ui/ChartTooltip';
import { formatLatencyForAxis, getLatencyColor } from '../utils/format';

interface MonitoringChartProps {
  heartbeats: Heartbeat[];
  height?: number;
  showGrid?: boolean;
  color?: 'success' | 'warning' | 'danger' | 'default';
}

const countRanges = [
  { key: '50-points', count: 50 },
  { key: '25-points', count: 25 },
  { key: '10-points', count: 10 },
];

// Workaround: Safari & recharts issue with NaN values
// Ref: https://github.com/recharts/recharts/issues/2395
if (typeof window !== 'undefined') {
  const originalCreateElement = React.createElement;

  // @ts-ignore
  React.createElement = function patchedCreateElement(type, props, ...children) {
    if (props && typeof type === 'string') {
      if (
        type === 'rect' ||
        type === 'path' ||
        type === 'line' ||
        type === 'circle' ||
        type === 'svg'
      ) {
        const newProps = { ...props };
        if (
          newProps.width !== undefined &&
          (Number.isNaN(newProps.width) || newProps.width === null)
        ) {
          newProps.width = '0';
        }

        if (
          newProps.height !== undefined &&
          (Number.isNaN(newProps.height) || newProps.height === null)
        ) {
          newProps.height = '0';
        }

        if (newProps.x !== undefined && (Number.isNaN(newProps.x) || newProps.x === null)) {
          newProps.x = '0';
        }

        if (newProps.y !== undefined && (Number.isNaN(newProps.y) || newProps.y === null)) {
          newProps.y = '0';
        }

        return originalCreateElement(type, newProps, ...children);
      }
    }

    return originalCreateElement(type, props, ...children);
  };
}

export function MonitoringChart({
  heartbeats,
  height = 200,
  showGrid = false,
  color = 'default',
}: MonitoringChartProps) {
  const t = useTranslations();
  const [selectedRange, setSelectedRange] = useState('50-points');
  const [chartReady, setChartReady] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // wait for the chart to be ready before rendering
  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (mounted) {
        requestAnimationFrame(() => {
          if (mounted) {
            setChartReady(true);
          }
        });
      }
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const filteredData = React.useMemo(() => {
    if (!heartbeats || !Array.isArray(heartbeats)) return [];

    const count = countRanges.find((r) => r.key === selectedRange)?.count || 100;

    return heartbeats
      .slice(-count)
      .filter((hb) => hb && typeof hb.ping === 'number' && !Number.isNaN(hb.ping))
      .map((hb) => ({
        time: new Date(hb.time).getTime(),
        ping: hb.ping || 0,
        status: hb.status,
        color: getLatencyColor(hb.ping || 0),
      }));
  }, [heartbeats, selectedRange]);

  // Calculate min and max for better Y axis scaling
  const pings = filteredData.map((d) => d.ping).filter((p) => p > 0 && !Number.isNaN(p));
  const minPing = pings.length > 0 ? Math.max(0, Math.min(...pings) - 10) : 0;
  const maxPing = pings.length > 0 ? Math.max(...pings) + 10 : 100;

  const handleRangeChange = useCallback((key: React.Key) => {
    setSelectedRange(key as string);
  }, []);

  if (!filteredData.length) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-default-500">
        {t('noData')}
      </div>
    );
  }

  // ensure height is a number and greater than 0
  const chartHeight = typeof height === 'number' && height > 0 ? height : 200;

  const chartContent = (
    <div className="w-full h-full overflow-hidden">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <AreaChart
          data={filteredData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          className="[&_.recharts-surface]:outline-none"
        >
          <defs>
            <linearGradient id={`colorGradient-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="10%" stopColor={`hsl(var(--heroui-${color}-500))`} stopOpacity={0.3} />
              <stop offset="100%" stopColor={`hsl(var(--heroui-${color}-100))`} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              stroke="hsl(var(--heroui-default-200))"
              strokeDasharray="3 3"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
            interval="preserveStartEnd"
            style={{
              fontSize: 'var(--heroui-font-size-tiny)',
            }}
          />
          <YAxis
            domain={[minPing, maxPing]}
            hide={!showGrid}
            width={60}
            axisLine={false}
            tickLine={false}
            style={{
              fontSize: 'var(--heroui-font-size-tiny)',
            }}
            tickFormatter={formatLatencyForAxis}
            dx={-10}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{
              strokeWidth: 0,
            }}
          />
          <Area
            type="monotone"
            dataKey="ping"
            stroke={`hsl(var(--heroui-${color}))`}
            strokeWidth={2}
            fill={`url(#colorGradient-${color})`}
            animationDuration={1000}
            animationEasing="ease"
            connectNulls
            activeDot={{
              stroke: `hsl(var(--heroui-${color}))`,
              strokeWidth: 2,
              fill: 'hsl(var(--heroui-background))',
              r: 5,
            }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const placeholderContent = <div className="w-full" style={{ height: `${chartHeight}px` }} />;

  return (
    <div className="w-full mt-2" ref={chartContainerRef}>
      <div className="mb-4 mt-3 items-center justify-center flex gap-2">
        <Tabs
          size="sm"
          selectedKey={selectedRange}
          onSelectionChange={handleRangeChange}
          className="font-light text-sm"
        >
          {countRanges.map((range) => (
            <Tab key={range.key} title={t('nodeCount', { count: range.count })} />
          ))}
        </Tabs>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRange}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="w-full"
          style={{ minHeight: chartHeight, height: chartHeight }}
        >
          {chartReady ? chartContent : placeholderContent}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
