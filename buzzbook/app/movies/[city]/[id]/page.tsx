"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLocation } from "@/app/context/LocationContext"
import type { Movie,Reviews} from "@/app/types/movie"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Users, Play, Heart } from "lucide-react"
import Link from "next/link"
import AvatarImage from "@/components/fallback"

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addToWishlist ,wishlistMovies} = useLocation();
  const { fetchMovieDetails,city } = useLocation()
  const [movie, setMovie] = useState<Movie | null>(null)

useEffect(() => {
  console.log(id)
  if (id && (!movie || movie._id !== id)) {
    fetchMovieDetails(id).then((data) => {
      if (data) setMovie(data);
    });
  }
}, [id, fetchMovieDetails, movie]);

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
          <div className="absolute inset-0 h-16 w-16 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-t-pink-500 border-transparent"></div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDuration = (minutes: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const calculateAverageRating = (reviews:Reviews[]):number=> {
    if (!reviews || reviews.length === 0) return 0
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  return parseFloat(avg.toFixed(1)) 
  }

  const calculateRatingDistribution = (reviews:Reviews[]) => {
    if (!reviews || reviews.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      const rating = Math.round(review.rating > 5 ? review.rating / 2 : review.rating)
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++
      }
    })

    const total = reviews.length
    return {
      5: Math.round((distribution[5] / total) * 100),
      4: Math.round((distribution[4] / total) * 100),
      3: Math.round((distribution[3] / total) * 100),
      2: Math.round((distribution[2] / total) * 100),
      1: Math.round((distribution[1] / total) * 100),
    }
  }

const isInWishlist = wishlistMovies.some(
  (m) => m._id === movie._id
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 font-sans text-white">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden sm:h-[80vh] lg:h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={movie.poster_img[0] || "/placeholder.svg"}
            alt={movie.title}
            fill
            priority
            className="object-cover object-center blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/60 via-transparent to-pink-950/60" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="mx-auto w-full max-w-7xl">
            {/* Mobile Layout */}
            <div className="flex flex-col items-center space-y-6 text-center lg:hidden">
              {/* Movie Poster - Mobile */}
              <div className="group relative">
                <div className="relative">
                  <Image
                    src={movie.poster_img[0] || "/placeholder.svg"}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className="h-auto w-40 rounded-xl object-cover shadow-2xl sm:w-48"
                  />
                </div>
              </div>

              {/* Movie Info - Mobile */}
              <div className="max-w-md space-y-4">
                <h1 className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-balance text-2xl font-bold leading-tight text-transparent sm:text-3xl">
                  {movie.title}
                </h1>

                {/* Genres */}
                <div className="flex flex-wrap justify-center gap-2">
                  {movie.genre.slice(0, 3).map((g, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border border-white/20 bg-white/10 text-xs text-white backdrop-blur-md"
                    >
                      {g}
                    </Badge>
                  ))}
                  {movie.genre.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="border border-white/20 bg-white/10 text-xs text-white backdrop-blur-md"
                    >
                      +{movie.genre.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Rating and Meta Info */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2.5 py-1">
                    <Star className="h-3 w-3 fill-current text-black" />
                    <span className="text-xs font-semibold text-black">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <span className="text-xs">{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">{formatDate(movie.release_date)}</span>
                  </div>
                  <div className="rounded border border-green-500/30 bg-green-600/20 px-2 py-1 text-xs font-medium text-green-300">
                    {movie.certification || "U/A"}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link   href={`/theatres/${city}/${movie.title}`}>
                  <Button className="transform-gpu rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25 sm:text-base">
                    <Play className="mr-1 h-4 w-4 sm:mr-2" />
                    Book Tickets
                  </Button></Link>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:text-base"
                    >
                      <Users className="mr-1 h-4 w-4 sm:mr-2" />
                      With Friends
                    </Button>
                   <button
  onClick={() => addToWishlist(movie._id,movie.theaterId ?? null)}
  className="p-1 rounded-full border border-white/10 hover:bg-white/10 transition"
>
  <Heart
    className={`h-4 w-4 sm:h-5 sm:w-5 ${
      isInWishlist ? "text-red-500 fill-red-500" : "text-white"
    }`}
  />
</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden items-center gap-12 lg:flex xl:gap-16">
              {/* Movie Poster - Desktop */}
              <div className="group relative flex-shrink-0">
                <div className="absolute -inset-1 rounded-2xl group-hover:opacity-100"></div>
                <div className="relative">
                  <Image
                    src={movie.poster_img[0] || "/placeholder.svg"}
                    alt={movie.title}
                    width={320}
                    height={480}
                    className="h-auto w-72 rounded-xl object-cover shadow-2xl xl:w-80"
                  />
                </div>
              </div>

              {/* Movie Info - Desktop */}
              <div className="flex-1 space-y-6 xl:space-y-8">
                <div>
                  <h1 className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-balance text-4xl font-bold leading-tight text-transparent xl:text-6xl">
                    {movie.title}
                  </h1>

                  {/* Genres - Desktop */}
                  <div className="mb-6 flex flex-wrap gap-3">
                    {movie.genre.slice(0, 4).map((g, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
                      >
                        {g}
                      </Badge>
                    ))}
                    {movie.genre.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white backdrop-blur-md"
                      >
                        +{movie.genre.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating and Meta Info - Desktop */}
                <div className="flex flex-wrap items-center gap-6 text-base xl:text-lg">
                  <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2">
                    <Star className="h-5 w-5 fill-current text-black" />
                    <span className="font-semibold text-black">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-5 w-5" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-balance">{movie.industry}</span>
                  </div>
                  <div className="rounded-lg border border-green-500/30 bg-green-600/20 px-3 py-1.5 font-medium text-green-300">
                    {movie.certification || "U/A"}
                  </div>
                </div>

                {/* Action Buttons - Desktop */}
                <div className="flex flex-wrap gap-4 pt-4">                  <Link   href={`/theatres/${city}/${movie.title}`}>
                  <Button className="transform-gpu rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25">
                    <Play className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/20 bg-white/10 px-8 py-3 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Friends
                  </Button>
                   <button
  onClick={() => addToWishlist(movie._id,movie.theaterId ?? null)}
  className="p-1 rounded-full border border-white/10 hover:bg-white/10 transition"
>
  <Heart
    className={`h-4 w-4 sm:h-5 sm:w-5 ${
      isInWishlist ? "text-red-500 fill-red-500" : "text-white"
    }`}
  />
</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900 to-slate-900">
        <div className="mx-auto space-y-8 px-4 py-8 pb-24 sm:px-6 sm:py-12 sm:pb-32 lg:space-y-12 lg:px-10 lg:py-16">
          {/* Movie Details Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
            <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent sm:mb-6 sm:text-2xl lg:text-3xl">
              Movie Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Type</h3>
                <p className="text-base text-white">{movie.Type}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Director</h3>
                <p className="text-base text-white">{movie.director}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Production House</h3>
                <p className="text-base text-white">{movie.production_house}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Industry</h3>
                <p className="text-base text-white">{movie.industry}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.language.slice(0, 3).map((lang, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="border border-blue-500/30 bg-blue-500/20 text-xs text-blue-300"
                    >
                      {lang}
                    </Badge>
                  ))}
                  {movie.language.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="border border-blue-500/30 bg-blue-500/20 text-xs text-blue-300"
                    >
                      +{movie.language.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Release Date</h3>
                <p className="text-base text-white">{formatDate(movie.release_date)}</p>
              </div>
            </div>
          </div>

          {/* Synopsis Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
            <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent sm:mb-6 sm:text-2xl lg:text-3xl">
              Synopsis
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg">
              {movie.description}
            </p>
          </div>

          {/* Cast & Crew Section */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
            <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent sm:mb-8 sm:text-2xl lg:text-3xl">
              Cast & Crew
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movie.cast.map((member, index) => (
                <div key={index} className="group text-center">
                  <div className="relative mb-3">
                    <div className="relative">
                      <AvatarImage
                        src={member.photo}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="mx-auto h-16 w-16 rounded-full border-2 border-white/20 object-cover transition-all duration-300 group-hover:border-white/40 sm:h-20 sm:w-20"
                      />
                    </div>
                  </div>
                  <h3 className="mb-1 text-balance text-xs font-semibold text-white sm:text-sm">{member.name}</h3>
                  <p className="text-balance text-xs text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
            <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent sm:mb-8 sm:text-2xl lg:text-3xl">
              Reviews & Ratings
            </h2>

            {movie.reviews && movie.reviews.length > 0 ? (
              <>
                {/* Overall Rating Summary */}
                <div className="mb-6 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 sm:mb-8 sm:p-6">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className="text-center">
                      <div className="mb-1 text-3xl font-bold text-white sm:text-4xl">
                        {calculateAverageRating(movie.reviews)}
                      </div>
                      <div className="mb-2 flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                             i < Math.floor(calculateAverageRating(movie.reviews))
                                ? "fill-current text-yellow-400"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-400">{movie.reviews.length} reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {(() => {
                        const distribution = calculateRatingDistribution(movie.reviews)
                        return [5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="w-8 text-sm text-gray-400">{stars}★</span>
                            <div className="h-2 flex-1 rounded-full bg-gray-700">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                style={{
                                  width: `${distribution[stars as keyof typeof distribution]}%`,
                                }}
                              />
                            </div>
                            <span className="w-12 text-sm text-gray-400">
                              {distribution[stars as keyof typeof distribution]}%
                            </span>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-4 sm:space-y-6">
                  {movie.reviews.slice(0, 5).map((review:Reviews, index: number) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/5 bg-slate-800/50 p-4 transition-all duration-300 hover:bg-slate-800/70 sm:p-6"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 sm:h-10 sm:w-10">
                            <span className="text-sm font-semibold text-white sm:text-base">
                              {review.critic_name ? review.critic_name.charAt(0).toUpperCase() : "C"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white sm:text-base">
                              {review.critic_name || "Anonymous Critic"}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(review.rating) ? "fill-current text-yellow-400" : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              {/* <span className="text-xs text-gray-400">
                                {review.created_at ? formatDate(review.created_at) : "Recently"}
                              </span> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="mb-3 text-pretty text-sm leading-relaxed text-gray-300 sm:text-base">
                        {review.review || "No review provided"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <button className="flex items-center gap-1 transition-colors hover:text-white">
                          <Heart className="h-3 w-3" />
                          Helpful ({review.helpful_count || 0})
                        </button>
                        <button className="transition-colors hover:text-white">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More Reviews Button */}
                {movie.reviews.length > 5 && (
                  <div className="mt-6 text-center sm:mt-8">
                    <Button
                      variant="outline"
                      className="rounded-xl border-white/20 bg-white/10 px-6 py-3 text-white transition-all duration-300 hover:bg-white/20"
                    >
                      Show More Reviews ({movie.reviews.length - 5} more)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Star className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">No Reviews Yet</h3>
                <p className="mb-6 text-gray-400">Be the first to share your thoughts about this movie!</p>
              </div>
            )}

            {/* Write Review Button */}
            <div className="mt-6 text-center sm:mt-8">
              <Button
                variant="outline"
                className="rounded-xl border-purple-500/30 bg-purple-500/10 px-6 py-3 text-purple-300 transition-all duration-300 hover:bg-purple-500/20 hover:text-white"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
        <div className="mx-auto max-w-sm rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900/95 to-slate-800/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <Link   href={`/theatres/${city}/${movie.title}`}>
            <Button className="transform-gpu flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25 sm:py-3 sm:text-base">
              <Play className="mr-1 h-4 w-4 sm:mr-2" />
              Book Now
            </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-white/20 bg-white/10 py-2.5 text-sm text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:py-3 sm:text-base"
            >
              <Users className="mr-1 h-4 w-4 sm:mr-2" />
              Friends
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
