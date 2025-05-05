'use client';

import { Button, Checkbox, Input, Kbd, Link } from '@heroui/react';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  Tooltip,
} from '@heroui/react';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';

import { GithubIcon, SearchIcon } from '@/components/basic/icons';
import { ThemeSwitch } from '@/components/basic/theme-switch';
import { NavbarSkeleton } from '@/components/ui/CommonSkeleton';
import { apiConfig } from '@/config/api';
import { siteConfig } from '@/config/site';
import { motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { useNodeSearch } from '../context/NodeSearchContext';
import { I18NSwitch } from './i18n-switch';

const isExternalUrl = (url: string) => {
  return url?.startsWith('http://') || url?.startsWith('https://');
};

export const Navbar = () => {
  const t = useTranslations();
  const { searchTerm, setSearchTerm, clearSearch, isFiltering } = useNodeSearch();

  if (!apiConfig) {
    return <NavbarSkeleton />;
  }

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  const searchInput = (
    <div className="relative">
      <Input
        aria-label={t('navbar.search')}
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm',
        }}
        endContent={
          !isFiltering && (
            <Kbd className="hidden lg:inline-block" keys={['command']}>
              K
            </Kbd>
          )
        }
        value={searchTerm}
        onChange={handleSearchChange}
        isClearable={isFiltering}
        onClear={clearSearch}
        labelPlacement="outside"
        placeholder={t('node.search')}
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    </div>
  );

  const starButton = (
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
  );

  const getIconUrl = () => {
    if (apiConfig.siteMeta.icon) {
      return isExternalUrl(apiConfig.siteMeta.icon)
        ? apiConfig.siteMeta.icon
        : new URL(apiConfig.siteMeta.icon, apiConfig.baseUrl).toString();
    }
    return '';
  };

  return (
    <HeroUINavbar maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              src={getIconUrl() || '/icon.svg'}
              alt={`${apiConfig.siteMeta.title} logo`}
              width={34}
              height={34}
            />
            <p className="font-bold text-inherit">{apiConfig.siteMeta.title}</p>
          </NextLink>
        </NavbarBrand>
        <nav aria-label={t('navbar.main')}>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
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
              </li>
            ))}
          </ul>
        </nav>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <nav aria-label={t('navbar.toolbar')}>
          <ul className="flex items-center gap-4">
            <li>
              <ThemeSwitch />
            </li>
            <li>
              <I18NSwitch />
            </li>
            <li className="hidden lg:block">
              <div className="flex flex-col">{searchInput}</div>
            </li>
            <li className="hidden sm:block">{apiConfig.isShowStarButton && starButton}</li>
          </ul>
        </nav>
      </NavbarContent>

      {/* 移动端 */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <nav aria-label={t('navbar.toolbar')}>
          <ul className="flex items-center gap-2">
            <li>
              <ThemeSwitch />
            </li>
            <li>
              <I18NSwitch />
            </li>
            <li>
              <NavbarMenuToggle
                icon={(isOpen) => (
                  <motion.div
                    variants={{
                      closed: { rotate: 0, opacity: 1 },
                      open: { rotate: 90, opacity: 1 },
                    }}
                    animate={isOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.3 }}
                    className="text-default-500"
                  >
                    {isOpen ? <X width={24} /> : <Menu size={24} />}
                  </motion.div>
                )}
              />
            </li>
          </ul>
        </nav>
      </NavbarContent>

      <NavbarMenu className="z-[60]">
        {apiConfig.isShowStarButton && starButton}
        <div className="flex flex-col gap-4">{searchInput}</div>
        <nav aria-label={t('navbar.mobileNav')}>
          <ul className="mx-4 mt-4 flex flex-col gap-2">
            {siteConfig.navItems.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? 'primary'
                      : index === siteConfig.navItems.length - 1
                        ? 'danger'
                        : 'foreground'
                  }
                  href={item.href}
                  target={item.external ? '_blank' : '_self'}
                  size="lg"
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
