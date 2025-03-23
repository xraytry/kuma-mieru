'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

import { DiscordIcon, GithubIcon, Logo, SearchIcon, TwitterIcon } from '@/components/basic/icons';
import { ThemeSwitch } from '@/components/basic/theme-switch';
import { NavbarSkeleton } from '@/components/ui/CommonSkeleton';
import { siteConfig } from '@/config/site';
import { useSourceConfig } from '@/hooks/useSourceConfig';
import type { Config } from '@/types/config';
import { useTranslations } from 'next-intl';
import { I18NSwitch } from './i18n-switch';

const isExternalUrl = (url: string) => {
  return url?.startsWith('http://') || url?.startsWith('https://');
};

export const Navbar = () => {
  const t = useTranslations();
  const { data: sourceConfig, isLoading } = useSourceConfig();
  const [apiConfig, setApiConfig] = useState<Config | null>(null);
  const [isApiLoading, setIsApiLoading] = useState(true);

  useEffect(() => {
    const fetchApiConfig = async () => {
      try {
        const response = await fetch('/api/metaInfo');
        const data = await response.json();
        if (response.ok && data.success) {
          setApiConfig(data);
        } else {
          console.error('Failed to fetch API config:', data.error);
        }
      } catch (error) {
        console.error('Failed to fetch API config:', error);
      } finally {
        setIsApiLoading(false);
      }
    };

    fetchApiConfig();
  }, []);

  if (isLoading || !sourceConfig?.config || isApiLoading || !apiConfig) {
    return <NavbarSkeleton />;
  }

  const searchInput = (
    // TODO: 实现节点过滤器
    <Input
      isDisabled
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={t('nodeSearch')}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const navItems = [
    {
      label: 'pageMain',
      href: '/',
      external: false,
    },
    {
      label: 'pageEdit',
      href: `${apiConfig.baseUrl}/manage-status-page`,
      external: true,
    },
  ];

  const getIconUrl = () => {
    if (sourceConfig.config.icon) {
      return isExternalUrl(sourceConfig.config.icon)
        ? sourceConfig.config.icon
        : new URL(sourceConfig.config.icon, apiConfig.baseUrl).toString();
    }
    return '';
  };

  return (
    <HeroUINavbar maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            {getIconUrl() ? (
              <Image
                src={getIconUrl()}
                alt={`${sourceConfig.config.title} logo`}
                width={34}
                height={34}
              />
            ) : (
              <Logo />
            )}
            <p className="font-bold text-inherit">{sourceConfig.config.title}</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={item.href}
                target={item.external ? '_blank' : '_self'}
              >
                {t(item.label)}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-4">
          <ThemeSwitch />
          <I18NSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.github}
            startContent={<GithubIcon />}
            variant="flat"
          >
            Star on Github
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="z-[60]">
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2 ? 'primary' : index === navItems.length - 1 ? 'danger' : 'foreground'
                }
                href={item.href}
                size="lg"
              >
                {t(item.label)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
