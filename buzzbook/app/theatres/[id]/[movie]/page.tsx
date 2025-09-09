"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLocation } from "@/app/context/LocationContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Car,
  Utensils,
  Wifi,
  CreditCard,
  Info,
} from "lucide-react"
// import type { Movie } from "@/app/types/movie"
export default function TheatrePage() {
const {city,movieDet,fetchTheatres,theatres} = useLocation();
 const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const movieName = movieDet?.title;

const generateDates = () => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      return {
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        dayNum: date.getDate().toString().padStart(2, "0"),
        month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      }
    })
  }

  const dates = generateDates()

  useEffect(() => {
    if (dates.length > 0) setSelectedDate(dates[0].date)
  }, [])

const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "parking":
        return <Car className="w-4 h-4" />
      case "food":
        return <Utensils className="w-4 h-4" />
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "card":
        return <CreditCard className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getShowtimeColor = (format: string, price: number) => {
    if (format.includes("IMAX"))
      return "bg-purple-500/20 text-purple-200 border-purple-400/40 hover:bg-purple-500/30"
    if (format.includes("4DX"))
      return "bg-red-500/20 text-red-200 border-red-400/40 hover:bg-red-500/30"
    if (format.includes("DOLBY"))
      return "bg-blue-500/20 text-blue-200 border-blue-400/40 hover:bg-blue-500/30"
    if (price > 300)
      return "bg-yellow-500/20 text-yellow-200 border-yellow-400/40 hover:bg-yellow-500/30"
    return "bg-green-500/20 text-green-200 border-green-400/40 hover:bg-green-500/30"
  }

useEffect(()=>{
  if(city&&movieName){
    fetchTheatres(movieName,city);
  }
},[movieName,city,fetchTheatres]);
//showtime:

  if (!movieName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  return (
       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
               <h1 className="text-2xl lg:text-3xl font-bold text-white text-pretty">
                {movieName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                  {Math.floor(movieDet.duration/ 60)}h {movieDet.duration % 60}m
                </Badge>
                <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                  {movieDet.certification}
                </Badge>
                {movieDet.genre.slice(0, 2).map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="border-slate-600 text-slate-300"
                  >
                    {g}
                  </Badge>
                ))}
              </div> 
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Date Selector */}
        <div className="mb-6 overflow-x-auto flex gap-2 pb-2">
          {dates.map((date) => (
            <Button
              key={date.date}
              variant={selectedDate === date.date ? "default" : "outline"}
              className={`flex-shrink-0 flex flex-col items-center min-w-[80px] ${
                selectedDate === date.date
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
              onClick={() => setSelectedDate(date.date)}
            >
              <span className="text-xs font-medium">{date.day}</span>
              <span className="text-lg font-bold">{date.dayNum}</span>
              <span className="text-xs">{date.month}</span>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Languages</SelectItem>
              {/* {movie.language.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-200">₹0 - ₹200</SelectItem>
              <SelectItem value="200-400">₹200 - ₹400</SelectItem>
              <SelectItem value="400+">₹400+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="2D">2D</SelectItem>
              <SelectItem value="3D">3D</SelectItem>
              <SelectItem value="IMAX">IMAX</SelectItem>
              <SelectItem value="4DX">4DX</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
              <SelectValue placeholder="Preferred Time" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theatres List */}
        <div className="space-y-6">
          {theatres.length === 0 ? (
            <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No Shows Available
                </h3>
                <p className="text-slate-400 text-lg">
                  No theatres are showing this movie in {city} for the selected
                  date.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Try selecting a different date or check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            theatres.map((theatre) => (
              <Card
                key={theatre._id}
                className="bg-slate-800/60 border-slate-700/50 backdrop-blur-xl rounded-2xl hover:shadow-xl transition-all"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                    {/* Theatre Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {theatre.name}
                      </h3>
                      {theatre.location && (
                        <p className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          {theatre.location.city}, {theatre.location.state},{" "}
                          {theatre.location.country}
                        </p> )}
                      

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-6">
                         {theatre.facilities.map((amenity) => (
                          <span
                            key={amenity}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-slate-700/50 border border-slate-600 text-slate-200"
                          >
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))} 
                      </div>

                      {/* Showtimes */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
  {theatre.audis.flatMap((audi, audiIndex) =>
    audi.films_showing.flatMap((film, filmIndex) =>
      film.showtimes.map((showtime, showtimeIndex) => (
        <Button
          key={`${theatre._id}-${audiIndex}-${filmIndex}-${showtimeIndex}`}
          variant="outline"
          className="p-4 rounded-xl text-center border-2 border-slate-600 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 transition-transform"
        >
          <div className="flex flex-col items-center">
            <span className="font-bold">{showtime.time}</span>
            <span className="text-sm text-slate-300">₹{showtime.price}</span>
          </div>
        </Button>
      ))
    )
  )}
</div>



                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

