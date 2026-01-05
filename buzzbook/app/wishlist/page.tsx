
"use client";

import React, { useEffect } from "react";
import { useLocation } from "@/app/context/LocationContext";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function WishlistPage() {
  const {user}=useAuth();
  const router=useRouter();
  const { wishlistMovies, wishlistTheater, getWishlist, addToWishlist } =
    useLocation();
  useEffect(()=>{
     if(!user){
      router.replace(`/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`);
     }
  },[user])
  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 p-6 text-white">
      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-10 mt-20">
      </h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-purple-200">
          🎬 Saved Movies
        </h2>

        {wishlistMovies.length === 0 ? (
          <p className="text-slate-400 text-sm">No movies saved yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
                {/* ❤️ HEART BUTTON ON TOP RIGHT */}
                <button
                  onClick={() => addToWishlist(movie._id, null)}
                  className="
                    absolute top-5 right-4 z-20 h-8 w-8 flex items-center justify-center
                    rounded-full bg-white/10 backdrop-blur-md
                    border border-white/10 shadow-sm
                    hover:bg-white/20 hover:scale-110 active:scale-90
                    transition-all duration-200
                  "
                >
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </button>

                {/* POSTER */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden">
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

                <p className="text-xs text-slate-400 line-clamp-1">
                  {movie.genre?.join(", ")}
                </p>

                {/* VIEW DETAILS */}
                <div className="mt-3 flex justify-between items-center">
                  <Link
                    href={`/movies/${movie._id}`}
                    className="text-xs text-purple-300 hover:text-purple-200 transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ----------------------------------------------------- */}
      {/* THEATRE SECTION */}
      {/* ----------------------------------------------------- */}
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
                {/* HEADER ROW */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {theatre.name}
                  </h3>

                  {/* Heart */}
                  <button
                    onClick={() => addToWishlist("", theatre._id)}
                    className="
                      h-8 w-8 flex items-center justify-center rounded-full
                      bg-white/10 backdrop-blur-md border border-white/10
                      hover:bg-white/20 hover:scale-110 active:scale-90
                      transition-all duration-200
                    "
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* ADDRESS */}
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="h-4 w-4 text-purple-300" />
                  <span className="line-clamp-1">{theatre.address}</span>
                </div>

                {/* FACILITIES */}
                <div className="mt-2 text-xs text-slate-400 line-clamp-1">
                  {theatre.facilities?.slice(0, 3).join(" • ")}...
                </div>

                {/* VIEW THEATRE */}
                <Link
                  href={`/theatre/${theatre._id}`}
                  className="
                    mt-4 inline-block text-xs text-purple-300 hover:text-purple-200
                    transition
                  "
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
