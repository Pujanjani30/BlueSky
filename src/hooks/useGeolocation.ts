import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeoloactionState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeoloactionState>({
    coordinates: null,
    error: null,
    isLoading: false,
  });

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Geolocation is not supported by this browser.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLocationData({
        coordinates: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        error: null,
        isLoading: false,
      });
    }, (error) => {
      let errorMessage: string;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied by the user. Please allow location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
        default:
          errorMessage = "An unknown error occurred.";
          break;
      }

      setLocationData({
        coordinates: null,
        isLoading: false,
        error: errorMessage,
      });
    },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0, // Do not use cached position
      }
    )
  }

  useEffect(() => {
    getLocation();
  }, []);

  return { ...locationData, getLocation };
}