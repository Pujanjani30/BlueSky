import type { WeatherData } from "@/api/types"
import useFavorites from "@/hooks/useFavorites";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  data: WeatherData & { state?: string };
}

const FavoriteButton = ({ data }: FavoriteButtonProps) => {
  const { addToFavorite, removeFavorite, isFavorite } = useFavorites();

  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleFavoriteToggle = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from favorites`);
    } else {
      addToFavorite({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
        state: data?.state,
      })
      toast.success(`Added ${data.name} to favorites`);
    }
  };


  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size={"icon"}
      className={`${isCurrentlyFavorite ? "bg-yellow-400 hover:bg-amber-600" : ""}`}
      onClick={handleFavoriteToggle}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  )
}
export default FavoriteButton