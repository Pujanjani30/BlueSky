import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "./useLocalStorage"

interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  state?: string;
  country: string;
  searchedAt: number;
}

const useSearchHistory = () => {
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>("search-history", []);

  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["search-history"],
    queryFn: () => history,
    initialData: history,
  });

  const addToHistory = useMutation({
    mutationFn: async (item: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
      const newItem: SearchHistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        searchedAt: Date.now(),
      };

      const fileteredHistory = history.filter(h => !(h.lat === newItem.lat && h.lon === newItem.lon)
      );

      const updatedHistory = [newItem, ...fileteredHistory].slice(0, 10);

      setHistory(updatedHistory);
      return updatedHistory;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["search-history"], data);
    }
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    }
  });

  return {
    history: historyQuery.data || [],
    addToHistory: addToHistory.mutate,
    clearHistory: clearHistory.mutate,
  };
}
export default useSearchHistory