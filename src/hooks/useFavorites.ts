import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "./useLocalStorage"

interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state?: string;
  country: string;
  addedAt: number;
}

const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("favorite-cities", []);

  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorite-cities"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const addToFavorite = useMutation({
    mutationFn: async (item: Omit<FavoriteCity, "id" | "addedAt">) => {
      const newItem: FavoriteCity = {
        ...item,
        id: `${item.lat}-${item.lon}`,
        addedAt: Date.now(),
      };

      const isExisting = favorites.some(fav => fav.id === newItem.id);
      if (isExisting) return favorites;

      const updatedFavorites = [...favorites, newItem].slice(0, 10);

      setFavorites(updatedFavorites);
      return updatedFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-cities"]
      })
    }
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter(fav => fav.id !== cityId);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorite-cities"]
      })
    }
  });

  return {
    favorites: favoritesQuery.data,
    addToFavorite: addToFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isFavorite: (lat: number, lon: number) => favorites.some(fav => fav.lat === lat && fav.lon === lon),
  };
}
export default useFavorites