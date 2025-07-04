import type { GeocodingData, WeatherData } from "@/api/types"
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData,
  locationName?: GeocodingData
}

function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed }
  } = data;

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2 place-ite">
          <div className="space-y-4">
            <div className="space-y-2">

              {/* Location Name & State */}
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    , {locationName.state}
                  </span>
                )}
              </div>

              {/* Location Country */}
              <p className="text-sm text-muted-foreground">
                {locationName?.country}
              </p>
            </div>

            {/* Temperatur Details */}
            <div className="flex items-center gap-2">

              {/* temperature */}
              <p className="text-7xl font-bold tracking-tight">
                {formatTemp(temp)}
              </p>

              <div className="space-y-1">

                {/* Feels like */}
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>

                {/* Max & Min Temperatue */}
                <div className="flex gap-2 text-sm font-medium">

                  {/* Min temp */}
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>

                  {/* Max temp */}
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>

                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* Humidity */}
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    Humidity
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {humidity}%
                  </p>
                </div>
              </div>

              {/* Wind speed */}
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    Wind Speed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {speed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 tezt-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default CurrentWeather