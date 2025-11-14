import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson) as string[];
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const addToSearchHistory = async (query: string): Promise<void> => {
  if (!query || !query.trim()) {
    return;
  }

  try {
    const history = await getSearchHistory();
    const trimmedQuery = query.trim();
    
    // Удаляем дубликаты
    const filteredHistory = history.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase());
    
    // Добавляем в начало
    const newHistory = [trimmedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

export const removeFromSearchHistory = async (query: string): Promise<void> => {
  try {
    const history = await getSearchHistory();
    const filteredHistory = history.filter((item) => item.toLowerCase() !== query.toLowerCase());
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

