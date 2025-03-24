import { Tooltip } from '@heroui/react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';

interface ResponsStatsProps {
  value: number;
  fill: string;
}

export function ResponsStats({ value, fill }: ResponsStatsProps) {
  const data = [{ value, fill }];
  const t = useTranslations();

  return (
      <Tooltip
        content={`${t('nodeUptimeStatus')}: ${value.toFixed(2)}%`}
        placement="left"
        delay={0}
        closeDelay={0}
        motionProps={{
          variants: {
            exit: {
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: 'easeOut',
              },
            },
            enter: {
              opacity: 1,
              transition: {
                duration: 0.15,
                ease: 'easeOut',
              },
            },
          },
        }}
      >
        <div className="w-10 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="85%"
              outerRadius="120%"
              data={data}
              startAngle={90}
              endAngle={-270}
              barSize={12}
              cx="50%"
              cy="50%"
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={30} fill={fill} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </Tooltip>
  );
}
