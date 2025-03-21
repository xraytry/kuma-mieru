'use client';

import { Skeleton } from '@heroui/react';
import { Navbar as HeroUINavbar, NavbarContent, NavbarBrand, NavbarItem } from '@heroui/navbar';

export const NavbarSkeleton = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <div className="flex justify-start items-center gap-2">
            <Skeleton className="flex rounded-full w-8 h-8" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Skeleton className="flex rounded-full w-8 h-8" />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Skeleton className="h-10 w-[200px] rounded-lg" />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Skeleton className="h-10 w-[140px] rounded-lg" />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Skeleton className="flex rounded-full w-8 h-8" />
        <Skeleton className="flex rounded-full w-8 h-8" />
        <Skeleton className="flex rounded-full w-8 h-8" />
      </NavbarContent>
    </HeroUINavbar>
  );
}; 