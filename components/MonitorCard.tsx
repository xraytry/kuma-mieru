'use client';
import type { Heartbeat, Monitor } from '@/types/monitor';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, MinusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MonitoringChart } from './charts/MonitoringChart';
import { ResponsStats } from './charts/ResponsStats';
import { StatusBlockIndicator } from './charts/StatusBlockIndicator';

interface MonitorCardProps {
  monitor: Monitor;
  heartbeats: Heartbeat[];
  uptime24h: number;
  isHome?: boolean;
}

export function MonitorCard({ monitor, heartbeats, uptime24h, isHome = true }: MonitorCardProps) {
  const router = useRouter();
  const [isSafari, setIsSafari] = useState(false);
  const t = useTranslations('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const isSafariBrowser =
        /Safari/i.test(userAgent) &&
        !/Chrome/i.test(userAgent) &&
        !/Chromium/i.test(userAgent) &&
        !/Edge/i.test(userAgent) &&
        !/Firefox/i.test(userAgent);

      setIsSafari(isSafariBrowser);
    }
  }, []);

  const lastHeartbeat = heartbeats[heartbeats.length - 1];
  const status = lastHeartbeat?.status ?? 0;

  const chartColor = status === 1 ? 'success' : status === 2 ? 'warning' : 'danger';

  const StatusIcon = status === 1 ? CheckCircle2 : status === 2 ? MinusCircle : AlertCircle;

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="group h-full"
      onClick={handleClick}
      whileHover={isHome ? { y: -3, transition: { duration: 0.2 } } : {}}
    >
      <Card
        className={clsx(
          'h-full grid grid-rows-[auto_1fr]',
          isHome ? 'w-full' : 'w-full md:w-2/3 mx-auto',
          isHome && 'cursor-pointer hover:shadow-md transition-all',
        )}
      >
        <CardHeader className="grid grid-cols-[1fr_auto] gap-4 items-start">
          <div className="grid grid-rows-[auto_minmax(28px,auto)] gap-2 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 w-full min-w-0">
              <StatusIcon className={`text-${chartColor} h-5 w-5 ml-1 flex-shrink-0`} />
              <h3 className="text-lg font-semibold truncate overflow-ellipsis max-w-full">
                {monitor.name}
              </h3>
            </div>
            <div>
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
          </div>
          <div className={clsx('flex-shrink-0', isHome ? '' : 'mr-4')}>
            <ResponsStats value={uptimeData[0].value} fill={uptimeData[0].fill} isHome={isHome} />
          </div>
        </CardHeader>
        <CardBody className="grid grid-rows-[auto_auto_1fr] gap-4">
          <StatusBlockIndicator heartbeats={heartbeats} isHome={isHome} />

          <Divider />

          <div className="self-end w-full">
            {!isSafari && (
              <MonitoringChart heartbeats={heartbeats} height={120} color={chartColor} showGrid />
            )}{' '}
            {isSafari && (
              <div className="w-full h-[120px] flex items-center justify-center text-default-500">
                {t('safariWarning')}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
