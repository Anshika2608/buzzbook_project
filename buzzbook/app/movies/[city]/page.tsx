"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useLocation } from "@/app/context/LocationContext"
import MovieCard from "@/components/card/MovieCard"

const MoviesPage = () => {
  const { city, setCity, movies } = useLocation()
  const params = useParams<{ city: string }>()

  const cityFromUrl = params.city

  useEffect(() => {
    if (cityFromUrl && cityFromUrl !== city) {
      setCity(cityFromUrl)
    }
  }, [cityFromUrl, city, setCity])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(148,163,184,0.08)_50%,transparent_75%)]" />

      <main className="relative z-10 px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:px-16">
        {/* Header */}
        <header className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm">
              Now Showing
            </span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
          </div>

          <h1 className="mb-3 text-balance text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text sm:text-4xl md:text-5xl lg:text-6xl">
            Movies in {cityFromUrl}
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-sm text-slate-400 sm:text-base">
            Discover the latest blockbusters and timeless classics playing near you
          </p>
        </header>

        {/* Movies grid */}
        {movies.length > 0 ? (
         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 lg:gap-8">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg ring-1 ring-slate-700/50">
              <span className="text-4xl">🎬</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-200 sm:text-2xl">
              No movies found
            </h3>
            <p className="max-w-md text-pretty text-slate-500 sm:text-base">
              Check back later for new releases in{" "}
              <span className="font-medium text-slate-300">{cityFromUrl}</span>.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default MoviesPage
