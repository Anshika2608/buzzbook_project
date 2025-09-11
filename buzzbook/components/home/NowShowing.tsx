"use client"

import { useLocation } from "@/app/context/LocationContext"
import HomeMovieCard from "@/components/card/HomeMovieCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const NowShowing = () => {
  // Directly get the current city and movies from the context
  const { city, movies } = useLocation()

  // We can limit the number of movies shown on the homepage, e.g., the first 10
  const moviesToShow = movies.slice(0, 10)

  return (
    <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:px-16">
      {/* Header for the homepage section */}
      <header className="mb-10 text-center sm:mb-14">
        <div className="mb-4 inline-flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
            Don't Miss Out
          </span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
        </div>

        <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text sm:text-4xl md:text-5xl">
          {/* Display the city from the context, with a fallback */}
          Now Showing in {city || "Your City"}
        </h2>
        <p className="mx-auto max-w-2xl text-pretty text-sm text-slate-400 sm:text-base">
          Explore the top movies currently playing in theaters near you.
        </p>
      </header>

      {/* Movies grid */}
      {moviesToShow.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 lg:gap-8">
            {moviesToShow.map((movie, index) => (
              <div
                key={movie._id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <HomeMovieCard movie={movie} />
              </div>
            ))}
          </div>
          {/* "View All" button below the grid */}
          <div className="mt-12 text-center">
             <Link href={`/movies/${city}`}>
               <Button
                variant="outline"
                className="group h-12 rounded-xl border-slate-700 bg-slate-800/50 px-8 text-sm font-bold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-slate-800/80 hover:text-white"
               >
                 <span className="flex items-center gap-2">
                   View All Movies
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
                       d="M17 8l4 4m0 0l-4 4m4-4H3"
                     />
                   </svg>
                 </span>
               </Button>
             </Link>
           </div>
        </>
      ) : (
        /* Empty state for when no movies are found */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg ring-1 ring-slate-700/50">
            <span className="text-4xl">🍿</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-200 sm:text-2xl">
            No Movies Showing
          </h3>
          <p className="max-w-md text-pretty text-slate-500 sm:text-base">
            It seems there are no movies available for{" "}
            <span className="font-medium text-slate-300">{city || "your selected city"}</span> right now.
          </p>
        </div>
      )}
    </div>
  )
}

export default NowShowing
