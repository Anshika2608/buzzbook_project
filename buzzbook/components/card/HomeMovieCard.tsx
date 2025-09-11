import type { Movie } from "@/app/types/movie"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { useLocation } from "@/app/context/LocationContext"
import { AspectRatio } from "../ui/aspect-ratio"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface HomeMovieCardProps {
  movie: Movie
}

export default function HomeMovieCard({ movie }: HomeMovieCardProps) {
  const { city } = useLocation()

  const getDisplayLanguages = (languages: string[]) => {
    if (languages.length <= 2) return { display: languages, hidden: [] }
    return {
      display: languages.slice(0, 2),
      hidden: languages.slice(2),
    }
  }

  const getDisplayGenres = (genres: string[]) => {
    if (genres.length <= 3) return genres.join(" • ")
    return `${genres.slice(0, 3).join(" • ")} • +${genres.length - 3} more`
  }
  const { display, hidden } = getDisplayLanguages(movie.language)
  return (
    <Card className="flex h-full flex-col group relative overflow-hidden rounded-2xl border border-slate-800/40 bg-gradient-to-br from-slate-900/95 via-slate-800/70 to-slate-900/95 backdrop-blur-md shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="relative p-0">
        <div className="relative w-full overflow-hidden rounded-xl p-3 sm:p-4">
          <AspectRatio ratio={4 / 3}> {/* Changed from 2 / 3 to 4 / 3 for a more rectangular, square-like shape */}
            {movie.poster_img?.[0] ? (
              <>
                <Image
                  src={movie.poster_img[0] || "/placeholder.svg"}
                  alt={`${movie.title} poster`}
                  fill
                  className="rounded-xl object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Rating badge */}
                <div className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 backdrop-blur-md">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-white text-xs font-medium">{movie.rating}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400">
                <div className="text-center">
                  <div className="mb-2 text-4xl">🎬</div>
                  <span className="text-sm">No Image</span>
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
      </CardContent>

      <CardHeader className=" flex-1 space-y-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-white transition-colors duration-300 group-hover:text-blue-100 sm:text-lg">
          {movie.title}
        </h3>

        <p
          className="line-clamp-1 text-xs text-slate-400 sm:text-sm"
          title={movie.genre.join(" • ")}
        >
          {getDisplayGenres(movie.genre)}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {display.map((lang, i) => (
            <Badge
              key={i}
              className="border-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-0.5 text-xs font-medium text-blue-200 backdrop-blur-sm"
            >
              {lang}
            </Badge>
          ))}

          {hidden.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="cursor-pointer border-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-2 py-0.5 text-xs font-medium text-blue-200 backdrop-blur-sm">
                  +{hidden.length} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs whitespace-pre-wrap">
                {hidden.join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>

      <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0 mt-auto">
        <Link href={`/movies/${city}/${movie._id}`} className="w-full">
          <Button className="group w-full h-10 rounded-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:shadow-xl hover:shadow-blue-500/25 sm:h-11">
            <span className="flex items-center justify-center gap-2">
              View Details
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}