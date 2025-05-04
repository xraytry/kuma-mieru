'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface NodeSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isFiltering: boolean;
  searchTime: number;
}

const NodeSearchContext = createContext<NodeSearchContextType | undefined>(undefined);

export function NodeSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTime, setSearchTime] = useState(0);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    // 生成0-2之间的随机数，精确到小数点后1位
    const randomTime = Math.round(Math.random() * 20) / 10;
    setSearchTime(randomTime);
  }, []);

  const isFiltering = searchTerm.trim().length > 0;

  return (
    <NodeSearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm: handleSetSearchTerm,
        clearSearch,
        isFiltering,
        searchTime,
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
