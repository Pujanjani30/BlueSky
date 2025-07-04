import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, Star } from "lucide-react";
import { useSearchLocationsQuery } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import useSearchHistory from "@/hooks/useSearchHistory";
import { format } from "date-fns";
import useFavorites from "@/hooks/useFavorites";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: locations, isLoading } = useSearchLocationsQuery(searchQuery)
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { favorites } = useFavorites();

  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, state, country] = cityData.split("|");

    addToHistory({
      query: searchQuery,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      state,
      country,
    })

    setOpen(false);
    setSearchQuery("");
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  }

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-between text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >

        <div className="flex items-center min-w-0">
          <Search className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Search cities...</span>
        </div>

        <p className="absolute right-2 hidden sm:block">
          <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 font-mono tracking-tighter">
            <span
              className="text-xs border text-muted-foreground bg-muted rounded px-1.5 py-0.5"
            >
              Ctrl
            </span>
            <span
              className="text-xs border text-muted-foreground bg-muted rounded px-1.5 py-0.5"
            >
              K
            </span>
          </kbd>
        </p >
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {searchQuery.length > 2 && !isLoading && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {favorites && favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((fav, index) => (
                <CommandItem
                  key={index}
                  value={`${fav.lat}|${fav.lon}|${fav.name}|${fav.state}|${fav.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>{fav.name}
                    {fav.state && (
                      <span className="text-sm text-muted-foreground">
                        , {fav.state}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {fav.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}


          {history && history.length > 0 && (
            <>
              <CommandSeparator />

              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant={"outline"}
                    size="sm"
                    onClick={() => clearHistory()}
                    className="h-6 px-2 text-xs"
                  >
                    {/* <XCircle className="h-4 w-4" /> */}
                    Clear
                  </Button>
                </div>

                {history.map((item, index) => (
                  <CommandItem
                    key={index}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.state}|${item.country}`}
                    onSelect={handleSelect}
                    className="flex"
                  >
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{item.name}
                      {item.state && (
                        <span className="text-sm text-muted-foreground">
                          , {item.state}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.country}
                    </span>
                    <span className="text-xs ml-auto text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location, index) => (
                <CommandItem
                  key={index}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.state}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <span>{location.name}
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
export default CitySearch