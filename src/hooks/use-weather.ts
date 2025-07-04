import type { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYs = {
  weather: (coords: Coordinates | null) => ["weather", coords] as const,
  forecast: (coords: Coordinates | null) => ["forecast", coords] as const,
  loaction: (coords: Coordinates | null) => ["location", coords] as const,
  search: (query: string) => ["search", query] as const,
}

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYs.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  })
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYs.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => coordinates ? weatherAPI.getForecast(coordinates) : null,
    enabled: !!coordinates,
  })
}
export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYs.loaction(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  })
}

export function useSearchLocationsQuery(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYs.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length > 2,
  })
}