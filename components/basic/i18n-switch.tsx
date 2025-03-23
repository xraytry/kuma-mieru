'use client';

import { locales } from '@/utils/i18n/config';
import { setUserLocale } from '@/utils/i18n/locale';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from '@heroui/react';
import { Languages, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';

export const I18NSwitch = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className={cn(
            'px-px transition-opacity hover:opacity-80 cursor-pointer',
            'w-auto h-auto',
            'bg-transparent',
            'rounded-lg',
            'flex items-center justify-center',
            'group-data-[selected=true]:bg-transparent',
            '!text-default-500',
            'pt-px',
            'px-0',
            'mx-0',
          )}
        >
          {isPending ? (
            <Loader2 size={22} className="animate-spin [animation-duration:0.3s]" />
          ) : (
            <Languages size={22} />
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" variant="faded">
        {locales.map((item) => (
          <DropdownItem
            key={item.key}
            onPress={() =>
              startTransition(() => {
                setUserLocale(item.key);
              })
            }
            className="flex flex-row items-center gap-2 text-default-500"
            startContent={
              <Image
                src={`https://fastly.jsdelivr.net/gh/HatScripts/circle-flags@2.7.0/flags/${item.alpha2Code.toLowerCase()}.svg`}
                alt={item.flag}
                width={24}
                height={24}
                className="w-6 h-6"
                loading="lazy"
              />
            }
            variant="faded"
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
