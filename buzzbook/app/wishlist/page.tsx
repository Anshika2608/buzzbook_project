"use client";

import React, { useEffect } from "react";
import { useLocation } from "@/app/context/LocationContext";
import Image from "next/image";
import { Heart, MapPin, Film } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistMovies, wishlistTheater, getWishlist, addToWishlist } =
    useLocation();

  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-6 text-white">
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-10">
        Your Wishlist
      </h1>

      {/* MOVIES */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">
          🎬 Saved Movies
        </h2>

        {wishlistMovies.length === 0 ? (
          <p className="text-slate-400 text-sm">No movies saved yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistMovies.map((movie) => (
              <div
                key={movie._id}
                className="
                relative group rounded-3xl p-3 backdrop-blur-xl
                bg-white/5 border border-white/10 
                shadow-[0px_10px_40px_rgba(0,0,0,0.4)]
                hover:shadow-[0px_20px_60px_rgba(0,0,0,0.55)]
                transition-all duration-300 hover:-translate-y-2
              "
              >
                {/* MOVIE POSTER */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={movie.poster_img?.[0] ?? "/placeholder.png"}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-2xl group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-sm font-bold text-white line-clamp-1">
                  {movie.title}
                </h3>

                <p className="text-xs text-slate-400">{movie.genre?.join(", ")}</p>

                {/* ACTIONS */}
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    href={`/movies/${movie._id}`}
                    className="text-xs text-purple-300 hover:text-purple-200 transition"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => addToWishlist(movie._id, null)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* THEATRES */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">
          🎭 Saved Theatres
        </h2>

        {wishlistTheater.length === 0 ? (
          <p className="text-slate-400 text-sm">No theatres saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistTheater.map((theatre) => (
              <div
                key={theatre._id}
                className="
                group rounded-3xl p-5 backdrop-blur-xl bg-white/5 border border-white/10
                shadow-[0px_10px_40px_rgba(0,0,0,0.4)]
                hover:shadow-[0px_20px_60px_rgba(0,0,0,0.55)]
                transition-all duration-300 hover:-translate-y-2
              "
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">
                    {theatre.name}
                  </h3>

                  <button
                    onClick={() => addToWishlist(null, theatre._id)}
                    className="
                      h-7 w-7 flex items-center justify-center rounded-full
                      bg-white/10 hover:bg-white/20 transition-all duration-200
                    "
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="h-4 w-4 text-purple-300" />
                  {theatre.address}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  {theatre.facilities?.slice(0, 3).join(" • ")}...
                </div>

                <Link
                  href={`/theatre/${theatre._id}`}
                  className="mt-4 inline-block text-xs text-purple-300 hover:text-purple-200 transition"
                >
                  View Theatre →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
