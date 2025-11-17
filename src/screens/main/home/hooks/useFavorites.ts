import { useCallback, useState } from 'react';

export function useFavorites() {
  const [favoriteNearby, setFavoriteNearby] = useState<Set<string>>(new Set());
  const [favoritePopular, setFavoritePopular] = useState<Set<string>>(new Set());
  const [favoriteSearch, setFavoriteSearch] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback(
    (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (clubId: string) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(clubId)) {
          next.delete(clubId);
        } else {
          next.add(clubId);
        }
        return next;
      });
    },
    [],
  );

  const toggleNearbyFavorite = useCallback(toggleFavorite(setFavoriteNearby), [toggleFavorite]);
  const togglePopularFavorite = useCallback(toggleFavorite(setFavoritePopular), [toggleFavorite]);
  const toggleSearchFavorite = useCallback(toggleFavorite(setFavoriteSearch), [toggleFavorite]);

  return {
    favoriteNearby,
    favoritePopular,
    favoriteSearch,
    toggleNearbyFavorite,
    togglePopularFavorite,
    toggleSearchFavorite,
  };
}


