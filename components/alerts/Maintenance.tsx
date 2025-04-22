'use client';

import { Alert } from '@/components/ui/Alert';
import type { Maintenance } from '@/types/config';
import { Progress } from '@heroui/react';
import { AlertCircle, Clock, Wrench } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { dateStringToTimestamp } from '../utils/format';

function MaintenanceAlert({ maintenance }: { maintenance: Maintenance }) {
  const t = useTranslations('maintenance');
  const format = useFormatter();
  const now = Date.now();

  const isActive = maintenance.status === 'under-maintenance';
  const isScheduled = maintenance.status === 'scheduled';

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Maintenance data:', maintenance);
    }
  }, [maintenance]);

  const getStatusTitle = () => {
    if (isActive) {
      return t('InProgress');
    }
    if (isScheduled) {
      return t('Scheduled');
    }
    return t('default');
  };

  const getMaintenanceTimeInfo = () => {
    if (!maintenance.timeslotList || maintenance.timeslotList.length === 0) {
      return null;
    }

    // 从维护数据中获取时区信息
    const timeZoneOffset = maintenance.timezoneOffset || 'UTC';
    let { startDate, endDate } = maintenance.timeslotList[0];

    // 处理日期字符串，移除末尾的时区信息
    if (startDate.endsWith('+0000')) {
      startDate = startDate.replace(' +0000', '');
    }
    if (endDate.endsWith('+0000')) {
      endDate = endDate.replace(' +0000', '');
    }

    // 在开发环境中记录处理后的日期和时区信息
    if (process.env.NODE_ENV === 'development') {
      console.log('处理后的开始日期:', startDate);
      console.log('处理后的结束日期:', endDate);
      console.log('使用的时区:', timeZoneOffset);
    }

    const startTime = dateStringToTimestamp(startDate, timeZoneOffset);
    const endTime = dateStringToTimestamp(endDate, timeZoneOffset);

    // 在开发环境中记录转换后的时间戳
    if (process.env.NODE_ENV === 'development') {
      console.log('开始时间戳:', startTime, new Date(startTime).toISOString());
      console.log('结束时间戳:', endTime, new Date(endTime).toISOString());
    }

    if (isActive) {
      const totalDuration = endTime - startTime;
      const elapsed = now - startTime;
      const progressPercent = Math.min(
        Math.max(Math.floor((elapsed / totalDuration) * 100), 0),
        100,
      );

      return (
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>{format.dateTime(startTime, 'normal')}</span>
            <span>{format.dateTime(endTime, 'normal')}</span>
          </div>
          <Progress
            value={progressPercent}
            color="warning"
            className="h-2"
            aria-label={t('Progress')}
          />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            <span>
              {t('EndsIn', {
                time: format.relativeTime(endTime, now),
              })}
            </span>
          </div>
        </div>
      );
    }

    if (isScheduled) {
      return (
        <div className="mt-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Clock size={16} />
          <span>
            {t('StartsIn', {
              time: format.relativeTime(startTime, now),
            })}
          </span>
        </div>
      );
    }

    return null;
  };

  const alertColor = isActive ? 'warning' : 'default';
  const StatusIcon = isActive ? Wrench : AlertCircle;
  const statusTitle = `${getStatusTitle()}: ${maintenance.title}`;

  return (
    <Alert
      title={statusTitle}
      description={maintenance.description}
      color={alertColor}
      variant="flat"
      className="mb-8"
      icon={<StatusIcon className="h-5 w-5" />}
    >
      <div className="flex items-center gap-2 mt-1 mb-8">
        <span className="font-medium">{statusTitle}</span>
      </div>

      {getMaintenanceTimeInfo()}

      <div className="flex flex-col items-end gap-1 mt-4">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {t('timezoneInfo', {
            timezone: maintenance.timezoneOffset || 'UTC',
          })}
        </span>
      </div>
    </Alert>
  );
}

export default MaintenanceAlert;
