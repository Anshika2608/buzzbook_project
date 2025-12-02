"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/app/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Car,
  Utensils,
  Wifi,
  CreditCard,
  Info,
  BadgeCheck,
  Ban,
  Heart
} from "lucide-react";
import MapModal from "@/components/modals/MapModal";
import { useBooking } from "@/app/context/BookingContext";

export default function TheatrePage() {
  const {
    city,
    movieDet,
    fetchTheatres,
    theatres,
    fetchPriceRanges,
    priceRanges = [],
    fetchFilteredTheatresPrice,
    fetchUniqueShowTime, wishlistTheater, addToWishlist
  } = useLocation();
  const router = useRouter();
  const { releaseHold } = useBooking();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [times, setTimes] = useState<string>("all");
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const movieName = movieDet?.title ?? "";
  console.log(theatres)
  // const isTheaterInWishlist = wishlistTheater.some(
  //   (t) => t._id === theatres._id
  // );

  const generateDates = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        dayNum: date.getDate().toString().padStart(2, "0"),
        month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      };
    });
  };

  const dates = generateDates();

  useEffect(() => {
    if (dates.length > 0) setSelectedDate(dates[0].date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return <Car className="h-4 w-4" />;
      case "food court":
        return <Utensils className="h-4 w-4" />;
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (city && movieName) {
      // Always fetch price ranges
      fetchPriceRanges(movieName, city);

      if (times !== "all") {
        // Fetch theatres filtered by selected time
        fetchUniqueShowTime(city, times, movieName);
      } else if (priceRange !== "all") {
        // Fetch theatres filtered by price
        fetchFilteredTheatresPrice(movieName, city, priceRange);
      } else {
        // Fetch all theatres
        fetchTheatres(movieName, city);
      }
    }
  }, [movieName, city, priceRange, times]);
  useEffect(() => {
    const tempId = localStorage.getItem("tempBookingId");
 
    if (tempId) {
      releaseHold(tempId); 
      localStorage.removeItem("tempBookingId");
    }
  }, []);


  if (!movieName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Movie not found</h2>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 font-sans text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="rounded-full bg-white/10 text-slate-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-400" />
              <p className="text-sm font-semibold text-slate-300">{city}</p>
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-2xl font-extrabold leading-tight text-transparent lg:text-3xl">
            {movieName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className="border-purple-500/30 bg-purple-500/20 px-2 py-0.5 font-medium text-purple-300">
              {Math.floor((movieDet?.duration ?? 0) / 60)}h {(movieDet?.duration ?? 0) % 60}m
            </Badge>
            <Badge className="border-slate-500/30 bg-slate-500/20 px-2 py-0.5 text-slate-300">
              {movieDet?.certification ?? "N/A"}
            </Badge>
            {(movieDet?.genre ?? []).slice(0, 2).map((g) => (
              <Badge key={g} variant="outline" className="border-slate-600/50 text-slate-400">
                {g}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Date Selector */}
        <div className="mb-6 flex overflow-x-auto pb-2">
          <div className="flex gap-3">
            {dates.map((date) => (
              <Button
                key={date.date}
                variant={selectedDate === date.date ? "default" : "outline"}
                className={`flex min-w-[70px] flex-col items-center rounded-xl p-3 shadow-lg transition-transform hover:scale-105 ${selectedDate === date.date
                  ? "bg-purple-600 text-white shadow-purple-500/30 hover:bg-purple-700"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                onClick={() => setSelectedDate(date.date)}
              >
                <span className="text-xs font-medium">{date.day}</span>
                <span className="text-lg font-bold">{date.dayNum}</span>
                <span className="text-xs">{date.month}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Select
            value={selectedLanguage}
            onValueChange={(v: string) => setSelectedLanguage(v)}
          >
            <SelectTrigger className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 focus:ring-purple-500">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-700 bg-slate-800 text-slate-200">
              <SelectItem value="all">All Languages</SelectItem>
              {(movieDet?.language ?? []).map((lang, i) => (
                <SelectItem key={i} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={(value) => setPriceRange(value)}>
            <SelectTrigger className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 focus:ring-purple-500">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-700 bg-slate-800 text-slate-200">
              <SelectItem value="all">All Prices</SelectItem>
              {priceRanges.length > 0 ? (
                priceRanges.map((range, i) => (
                  <SelectItem key={i} value={range}>
                    {range}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No Prices Available
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 focus:ring-purple-500">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-700 bg-slate-800 text-slate-200">
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="2D">2D</SelectItem>
              <SelectItem value="3D">3D</SelectItem>
              <SelectItem value="IMAX">IMAX</SelectItem>
              <SelectItem value="4DX">4DX</SelectItem>
            </SelectContent>
          </Select>

          <Select value={times} onValueChange={setTimes}>
            <SelectTrigger className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 focus:ring-purple-500">
              <SelectValue placeholder="Preferred Timing" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-700 bg-slate-800 text-slate-200">
              <SelectItem value="all">All Timings</SelectItem>
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
              <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* Theatres List */}
        <div className="space-y-6">
          {theatres?.length === 0 ? (

            <Card className="rounded-2xl border-slate-700/50 bg-slate-800/60 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
                  <Calendar className="h-10 w-10 text-purple-400" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  No Shows Available
                </h3>
                <p className="text-lg text-slate-400">
                  No theatres are showing this movie in {city} for the selected date.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Try selecting a different date or check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            theatres?.map((theatre) => {
              const isTheaterInWishlist =
                Array.isArray(wishlistTheater) &&
                wishlistTheater.some((t) => {
                  console.log("Wishlist Theater ID:", t._id);
                  console.log("Current Theatre ID:", theatre._id);
                  console.log("Match:", t._id === theatre._id);
                  console.log("----------------");
                  return t._id === theatre._id;
                });

              return (
                <Card
                  key={theatre._id}
                  className="rounded-2xl border-slate-700/50 bg-slate-800/60 p-6 backdrop-blur-xl transition-all hover:shadow-xl sm:p-8"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    {/* Left Column: Theatre Info & Amenities */}
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {theatre.name}
                      </h3><button
                        onClick={() => addToWishlist("", theatre._id)}
                        className="p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition"
                      >
                        <Heart
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${isTheaterInWishlist ? "text-red-500 fill-red-500" : "text-white"
                            }`}
                        />
                      </button>
                      {theatre.address && (
                        <p
                          onClick={() => {
                            setSelectedAddress(theatre.address);
                            setMapOpen(true);
                          }}
                          className="mb-2 flex cursor-pointer items-center gap-1 text-sm text-purple-400 hover:underline"
                        >
                          <MapPin className="h-4 w-4" />
                          {theatre.address}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">Contact: {theatre.contact}</p>
                      {/* Amenities */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {theatre.facilities.map((amenity) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-xs text-slate-200"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Showtimes & Policy */}
                    <div className="flex w-full flex-col justify-between items-end gap-4 lg:w-fit lg:flex-shrink-0">
                      {/* Cancellation Policy */}
                      <div className="flex items-center gap-2 rounded-xl bg-slate-700/50 p-2 text-xs text-slate-300 w-48 ">
                        {theatre.cancellationAvailable ? (
                          <>
                            <BadgeCheck className="h-4 w-4 text-green-400" />
                            <span className="font-medium text-green-400">Cancellation available</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 text-yellow-300" />
                            <span className="font-medium text-yellow-300">Cancellation not available</span>
                          </>
                        )}
                      </div>

                      {/* Showtimes */}
                      <div className="flex flex-wrap justify-end gap-3 lg:justify-start">
                        {theatre.showtimes?.map((showtime, index) => (
                          <Button
                            key={`${theatre._id}-${index}`}
                            variant="outline"
                            className="transform-gpu rounded-xl border-2 border-purple-600 bg-purple-800/50 p-4 text-center text-white transition-all hover:scale-105 hover:bg-purple-700"
                            onClick={() => {
                              const audi = theatre.audis[0];
                              const audi_number = audi?.audi_number ?? "";

                              const film = audi.films_showing.find(f => f.title === movieName);
                              const movie_language = film?.language ?? "";

                              router.push(
                                `/booking?theater_id=${theatre._id}&theatreName=${encodeURIComponent(
                                  theatre.name
                                )}&movie_title=${encodeURIComponent(
                                  movieName
                                )}&showtime=${showtime.time}&show_date=${selectedDate}&audi_number=${encodeURIComponent(
                                  audi_number
                                )}&movie_language=${encodeURIComponent(movie_language)}`
                              );
                            }}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-bold sm:text-base">{showtime.time}</span>
                              {/* <span className="text-xs text-slate-300">
                              {showtime.isFillingFast ? "Filling Fast" : "Available"}
                            </span> */}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>)
            })
          )}
          {selectedAddress && (
            <MapModal
              isOpen={mapOpen}
              onClose={() => setMapOpen(false)}
              address={selectedAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

