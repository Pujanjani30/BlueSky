import CurrentWeather from "@/components/CurrentWeather";
import FavoriteButton from "@/components/FavoriteButton";
import { HourlyTemperature } from "@/components/HourlyTemperature";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"

function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const state = locationQuery.data?.[0]?.state;

  if (weatherQuery.error || forecastQuery.error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again.</p>
        <Button
          variant={"outline"}
          className="w-fit"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {state}, {weatherQuery.data.sys.country}
        </h1>

        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName, state }}
          />
        </div>
      </div>

      {/* {!locationLoading && */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
          />
          <HourlyTemperature
            data={forecastQuery.data}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <WeatherDetails
            data={weatherQuery.data}
          />
          <WeatherForecast
            data={forecastQuery.data}
          />
        </div>
      </div>
      {/* } */}
    </div >
  )
}

export default CityPage