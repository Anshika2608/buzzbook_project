import { Movie } from "@/app/types/movie";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useLocation } from "@/app/context/LocationContext";
import { AspectRatio } from "../ui/aspect-ratio";

interface MovieCardProps {
  movie: Movie;
}
export default function MovieCard({ movie }: MovieCardProps) {
    const { city } = useLocation();
  return (
    <Card className="overflow-hidden rounded-2xl border border-purple-700 bg-gradient-to-b from-gray-900 via-black to-gray-950 shadow-lg  transition-all">
      <CardContent className="p-0">
        <div className="relative w-full overflow-hidden rounded-xl px-2 pt-2 sm:px-4 sm:pt-4"> 
          <AspectRatio>
          {movie.poster_img?.[0] ? (
            <Image
              src={movie.poster_img[0]}
              alt={`${movie.title} poster`}
              width={300}
              height={450}
              className="absolute h-full w-full object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
              loading="lazy"
            />
          ) : (
            <div className="h-[300px] w-full bg-gray-800 flex items-center justify-center text-white">
              No image
            </div>
          )}
          </AspectRatio>
        </div>
      </CardContent>

      <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2 ">
        <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white sm:text-xl md:text-2xl">
          {movie.title}
        </h3>
        <h4 className="text-xs text-[#95919a] sm:text-sm">{movie.genre.join(" , ")}</h4>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:mt-3 sm:text-sm">
          <Badge className="border border-purple-600 bg-purple-800/50 px-2 py-0.5 text-purple-200 sm:px-3 sm:py-1">
            {movie.language}
          </Badge>
          <Badge className="border border-yellow-500 bg-yellow-400/20 px-2 py-0.5 text-yellow-300 sm:px-3 sm:py-1">
            ⭐ {movie.rating}
          </Badge>
        </div>
      </CardHeader>

      <CardFooter className="p-4 pt-0 sm:p-6 sm:pt-0">
        <Link href={`/movies/${city}/${movie._id}`}>
        <Button 
        className="w-full rounded-xl bg-purple-700 font-medium text-white shadow-md transition-all hover:bg-purple-600 hover:shadow-purple-500/40">
          View More
        </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}


