import { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { addToSearchHistory, getSearchHistory, removeFromSearchHistory } from '@/src/shared/utils/search-history';

interface UseSearchOptions {
  scrollViewRef: React.RefObject<ScrollView | null>;
}

export function useSearch({ scrollViewRef }: UseSearchOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Загружаем историю поиска при монтировании
  useEffect(() => {
    getSearchHistory().then(setSearchHistory);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchSubmit = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }

    await addToSearchHistory(trimmedQuery);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, [searchQuery]);

  const handleSearchModeOpen = useCallback(() => {
    setIsSearchMode(true);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollViewRef]);

  const handleSearchModeCancel = useCallback(() => {
    setIsSearchMode(false);
    setSearchQuery('');
  }, []);

  const handleBackFromResults = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleHistoryItemPress = useCallback(async (query: string) => {
    setSearchQuery(query);
    await addToSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, []);

  const handleHistoryItemRemove = useCallback(async (query: string) => {
    await removeFromSearchHistory(query);
    const updatedHistory = await getSearchHistory();
    setSearchHistory(updatedHistory);
  }, []);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return {
    searchQuery,
    searchHistory,
    isSearchMode,
    hasSearchQuery,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchModeOpen,
    handleSearchModeCancel,
    handleBackFromResults,
    handleHistoryItemPress,
    handleHistoryItemRemove,
  };
}

