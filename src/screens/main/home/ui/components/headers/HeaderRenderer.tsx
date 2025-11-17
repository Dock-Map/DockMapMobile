import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeHeader from './HomeHeader';
import SearchTopBar from './SearchTopBar';
import SearchResultsHeader from './SearchResultsHeader';
import SearchHistory from '../search/SearchHistory';

interface HeaderRendererProps {
  isSearchMode: boolean;
  hasSearchQuery: boolean;
  selectedCity: string;
  searchQuery: string;
  activeFiltersCount: number;
  searchHistory: string[];
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchModeCancel: () => void;
  onBackFromResults: () => void;
  onFilters: () => void;
  onCityPress: () => void;
  onHistoryItemPress: (query: string) => void;
  onHistoryItemRemove: (query: string) => void;
}

export function HeaderRenderer({
  isSearchMode,
  hasSearchQuery,
  selectedCity,
  searchQuery,
  activeFiltersCount,
  searchHistory,
  onSearchChange,
  onSearchSubmit,
  onSearchModeCancel,
  onBackFromResults,
  onFilters,
  onCityPress,
  onHistoryItemPress,
  onHistoryItemRemove,
}: HeaderRendererProps) {
  // Режим поиска с запросом - показываем заголовок результатов
  if (isSearchMode && hasSearchQuery) {
    return (
      <SearchResultsHeader
        city={selectedCity}
        searchQuery={searchQuery}
        filtersCount={activeFiltersCount}
        onBack={onBackFromResults}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onFilters={onFilters}
      />
    );
  }

  // Режим поиска без запроса - показываем поле поиска и историю
  if (isSearchMode) {
    return (
      <>
        <SearchTopBar
          searchValue={searchQuery}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onCancel={onSearchModeCancel}
        />
        <View style={styles.searchHistoryWrapper}>
          <SearchHistory
            items={searchHistory}
            onItemPress={onHistoryItemPress}
            onItemRemove={onHistoryItemRemove}
          />
        </View>
      </>
    );
  }

  // Есть запрос, но не в режиме поиска - показываем заголовок результатов
  if (hasSearchQuery) {
    return (
      <SearchResultsHeader
        city={selectedCity}
        searchQuery={searchQuery}
        filtersCount={activeFiltersCount}
        onBack={onBackFromResults}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onFilters={onFilters}
      />
    );
  }

  // Обычный режим - показываем главный заголовок
  return (
    <HomeHeader
      selectedCity={selectedCity}
      onCityPress={onCityPress}
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      onFilters={onFilters}
    />
  );
}

const styles = StyleSheet.create({
  searchHistoryWrapper: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
});


