'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';

export type FilterStatus = 'all' | 'up' | 'down' | 'pending' | 'maintenance';

interface NodeSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isFiltering: boolean;
  searchTime: number;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  searchInGroup: boolean;
  setSearchInGroup: (value: boolean) => void;
}

const SEARCH_PARAM = 'search';
const STATUS_PARAM = 'status';
const SEARCH_GROUP_PARAM = 'group';

const DEBOUNCE_DELAY = 300; // ms

const NodeSearchContext = createContext<NodeSearchContextType | undefined>(undefined);

export function NodeSearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTermState] = useState<string>(searchParams.get(SEARCH_PARAM) || '');
  const [filterStatus, setFilterStatusState] = useState<FilterStatus>(
    (searchParams.get(STATUS_PARAM) as FilterStatus) || 'all',
  );
  const [searchInGroup, setSearchInGroupState] = useState<boolean>(
    searchParams.get(SEARCH_GROUP_PARAM) === 'true',
  );
  const [searchTime, setSearchTime] = useState(0);

  const updateUrl = useCallback(
    (newSearchTerm?: string, newFilterStatus?: FilterStatus, newSearchInGroup?: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newSearchTerm !== undefined) {
        if (newSearchTerm) {
          params.set(SEARCH_PARAM, newSearchTerm);
        } else {
          params.delete(SEARCH_PARAM);
        }
      }

      if (newFilterStatus !== undefined) {
        if (newFilterStatus !== 'all') {
          params.set(STATUS_PARAM, newFilterStatus);
        } else {
          params.delete(STATUS_PARAM);
        }
      }

      if (newSearchInGroup !== undefined) {
        if (newSearchInGroup) {
          params.set(SEARCH_GROUP_PARAM, 'true');
        } else {
          params.delete(SEARCH_GROUP_PARAM);
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Update the URL without refresh
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const debouncedSetSearchTerm = useCallback(
    debounce((term: string) => {
      setSearchTermState(term);
      updateUrl(term);
      const randomTime = Math.round(Math.random() * 20) / 10;
      setSearchTime(randomTime);
    }, DEBOUNCE_DELAY),
    [],
  );

  // Update filter status with URL sync
  const setFilterStatus = useCallback(
    (status: FilterStatus) => {
      setFilterStatusState(status);
      updateUrl(undefined, status);
    },
    [updateUrl],
  );

  const setSearchInGroup = useCallback(
    (value: boolean) => {
      setSearchInGroupState(value);
      updateUrl(undefined, undefined, value);
    },
    [updateUrl],
  );

  const clearSearch = useCallback(() => {
    setSearchTermState('');
    setFilterStatusState('all');
    setSearchInGroupState(false);
    updateUrl('', 'all', false);
  }, [updateUrl]);

  const isFiltering = useMemo(() => {
    return searchTerm.trim().length > 0 || filterStatus !== 'all' || searchInGroup;
  }, [searchTerm, filterStatus, searchInGroup]);

  // Re-sync with URL parameters when they change
  useEffect(() => {
    const urlSearchTerm = searchParams.get(SEARCH_PARAM) || '';
    const urlFilterStatus = (searchParams.get(STATUS_PARAM) as FilterStatus) || 'all';
    const urlSearchInGroup = searchParams.get(SEARCH_GROUP_PARAM) === 'true';

    if (urlSearchTerm !== searchTerm) {
      setSearchTermState(urlSearchTerm);
    }

    if (urlFilterStatus !== filterStatus) {
      setFilterStatusState(urlFilterStatus);
    }

    if (urlSearchInGroup !== searchInGroup) {
      setSearchInGroupState(urlSearchInGroup);
    }
  }, [searchParams, searchTerm, filterStatus, searchInGroup]);

  return (
    <NodeSearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm: debouncedSetSearchTerm,
        clearSearch,
        isFiltering,
        searchTime,
        filterStatus,
        setFilterStatus,
        searchInGroup,
        setSearchInGroup,
      }}
    >
      {children}
    </NodeSearchContext.Provider>
  );
}

export function useNodeSearch() {
  const context = useContext(NodeSearchContext);

  if (context === undefined) {
    throw new Error('useNodeSearch must be used within a NodeSearchProvider');
  }

  return context;
}
