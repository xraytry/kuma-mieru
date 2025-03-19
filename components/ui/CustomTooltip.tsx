import type { ReactNode } from "react";
import { Tooltip as HeroTooltip, type TooltipProps } from "@heroui/react";

export interface CustomTooltipProps extends Omit<TooltipProps, 'content'> {
  content: ReactNode;
  children: React.ReactElement;
  className?: string;
}

export function CustomTooltip({ content, children, className, ...props }: CustomTooltipProps) {
  return (
    <HeroTooltip
      content={
        <div className={`flex h-auto min-w-[140px] items-center gap-x-2 rounded-medium p-2 text-tiny shadow-small
          bg-default-100 dark:bg-default-50
          border border-divider/30 dark:border-divider/30 ${className || ""}`}>
          <div className='flex w-full flex-col gap-y-1'>
            {content}
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </HeroTooltip>
  );
} 