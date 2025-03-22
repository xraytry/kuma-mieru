import { Alert as HeroUIAlert, Button } from '@heroui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

interface AlertProps {
  title: string;
  description?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'bordered' | 'flat' | 'faded';
  className?: string;
  children?: React.ReactNode;
}

export const Alert = ({
  title,
  description,
  color = 'default',
  variant = 'flat',
  className,
  children,
}: AlertProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <HeroUIAlert
      className={clsx('cursor-pointer', className)}
      color={color}
      variant={variant}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between w-screen-full">
        <div className="flex-1">
          <h5 className="text-sm font-medium">{title}</h5>
          {!isExpanded && !children && description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {description}
            </p>
          )}
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="ml-2 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={clsx(
          'grid transition-all duration-200 ease-in-out w-full',
          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>
          )}
          {children}
        </div>
      </div>
    </HeroUIAlert>
  );
}; 