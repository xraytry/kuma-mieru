'use client';

import { type Locale, locales } from '@/utils/i18n/config';
import { setUserLocale } from '@/utils/i18n/locale';
import {
  Button,
  Dropdown as HeroUIDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { Languages, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';

export const I18NSwitch = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();

  const handleLocaleChange = (locale: Locale, localeName: string) => {
    startTransition(async () => {
      try {
        const toastId = toast.loading(t('locale.changing', { locale: localeName }));

        await setUserLocale(locale);

        toast.success(t('locale.changed', { locale: localeName }), {
          id: toastId,
        });

        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch (error) {
        console.error('Failed to change locale:', error);
        toast.error(
          `${t('locale.changeError')}: ${error instanceof Error ? error.message : t('error.unknown')}`
        );
      }
    });
  };

  return (
    <HeroUIDropdown aria-label="Switch Language">
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="text-default-500">
          {isPending ? (
            <Loader2 size={22} className="animate-spin [animation-duration:0.3s]" />
          ) : (
            <Languages size={22} />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Switch Language" variant="faded">
        {locales.map(item => (
          <DropdownItem
            key={item.key}
            onPress={() => handleLocaleChange(item.key, item.name)}
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
          >
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </HeroUIDropdown>
  );
};
