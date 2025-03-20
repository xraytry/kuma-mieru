'use client';
import { Card, CardBody, CardHeader, Badge, Progress, Chip, Divider } from '@heroui/react';
import type { Monitor, Heartbeat } from '@/types/monitor';
import { MonitoringChart } from './charts/MonitoringChart';
import { CheckCircle2, AlertCircle, MinusCircle } from 'lucide-react';
import { StatusBlockIndicator } from './charts/StatusBlockIndicator';
import { ResponsiveContainer, RadialBarChart, RadialBar, Cell, PolarAngleAxis } from 'recharts';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface MonitorCardProps {
  monitor: Monitor;
  heartbeats: Heartbeat[];
  uptime24h: number;
  isHome?: boolean;
}

export function MonitorCard({ monitor, heartbeats, uptime24h, isHome = true }: MonitorCardProps) {
  const router = useRouter();
  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const status = lastHeartbeat?.status ?? 0;

  const chartColor = status === 1 ? 'success' : status === 2 ? 'warning' : 'danger';

  const StatusIcon = status === 1 ? CheckCircle2 : status === 2 ? MinusCircle : AlertCircle;
  const statusText = status === 1 ? '在线' : status === 2 ? '维护中' : '离线';

  const uptimeData = [
    {
      value: uptime24h * 100,
      fill: uptime24h > 0.98 ? '#17c964' : uptime24h > 0.9 ? '#f5a524' : '#f31260',
    },
  ];

  const handleClick = () => {
    if (isHome) {
      router.push(`/monitor/${monitor.id}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={isHome ? "cursor-pointer transition-transform hover:scale-[1.02]" : ""}
      onClick={handleClick}
    >
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge color={chartColor} variant="flat" title={statusText}>
                <StatusIcon size={18} className={`text-${chartColor} h-4 w-4`} />
              </Badge>
              <h3 className="text-lg font-semibold">{monitor.name}</h3>
            </div>
            {monitor.tags && monitor.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {monitor.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    size="sm"
                    variant="flat"
                    style={{
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                    {tag?.value && `: ${tag.value}`}
                  </Chip>
                ))}
              </div>
            )}
          </div>
          <div className="inline-flex items-center">
            <div className="w-10 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  data={uptimeData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={30} fill="#17c964" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <span className="text-sm text-gray-500">{uptimeData[0].value.toFixed(2)}%</span>
          </div>
        </CardHeader>
        <CardBody>
          <StatusBlockIndicator heartbeats={heartbeats} className="mb-4" />

          <Divider className="my-2" />

          <div className="space-y-4">
            <MonitoringChart heartbeats={heartbeats} height={120} color={chartColor} showGrid />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
