"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import "@/app/globals.css"
import AddAudiForm from "@/components/forms/addAudiForm"
type Showtime = {
  _id: string;
  time: string;
  prices: {
    VIP: number;
    Premium: number;
    Regular: number;
  };
};

type Film = {
  _id: string;
  title: string;
  language: string;
  showtimes: Showtime[];
};

type Audi = {
  _id: string;
  audi_number: string;
  layout_type: string;
  rows: number;
  seatsPerRow: number;
  seating_capacity: number;
  films_showing?: Film[];
};

type Theater = {
  _id: string;
  name: string;
  address: string;
  contact: string;
  popular: boolean;
  theater_id: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  audis: Audi[];
};

export default function TheaterDetailsPage() {
  const params = useParams();
  const theaterId = params?.id as string;
  const [theater, setTheater] = useState<Theater | null>(null);
  const [isAddAudiOpen, setIsAddAudiOpen] = useState(false);
  const fetchTheater = async () => {
    try {
      const res = await axios.get(`https://buzzbook-server-dy0q.onrender.com/theater/${theaterId}`);
      setTheater(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (theaterId) {
      fetchTheater();
    }
  }, [theaterId]);

  if (!theater) return <p className="text-center mt-10 text-purple-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-400 text-center mb-6">
          {theater.name}
        </h1>
        <p className="mb-2">
          <strong className="text-purple-300">Address:</strong> {theater.address}
        </p>
        <p className="mb-2">
          <strong className="text-purple-300">Contact:</strong> {theater.contact}
        </p>
        <p className="mb-2">
          <strong className="text-purple-300">Location:</strong>{" "}
          {theater.location.city}, {theater.location.state},{" "}
          {theater.location.country}
        </p>
        <p className="mb-6">
          <strong className="text-purple-300">Popular:</strong>{" "}
          {theater.popular ? "Yes ✅" : "No ❌"}
        </p>

        <h2 className="text-2xl font-semibold text-purple-400 mb-4">
          Available Audis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {theater.audis.map((audi) => (
            <div
              key={audi._id}
              className="bg-black/30 backdrop-blur-lg border border-purple-700/40 rounded-2xl p-6 shadow-lg transition-transform transform hover:scale-101 hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]"
            >

              <h3 className="text-2xl font-extrabold text-purple-300 mb-3 border-b border-purple-600/40 pb-2">
                🎭 {audi.audi_number}
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="text-purple-400 font-semibold">Layout:</span> {audi.layout_type}</p>
                <p><span className="text-purple-400 font-semibold">Rows:</span> {audi.rows}</p>
                <p><span className="text-purple-400 font-semibold">Seats/Row:</span> {audi.seatsPerRow}</p>
                <p><span className="text-purple-400 font-semibold">Capacity:</span> {audi.seating_capacity}</p>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-yellow-300 mb-3">🎬 Films Showing</h4>
                {audi.films_showing && audi.films_showing.length > 0 ? (
                  <div
                    className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 "
                  >
                    {audi.films_showing.map((film) => (
                      <div
                        key={film._id}
                        className="bg-gradient-to-r from-purple-900/70 to-black/50 border border-purple-700 rounded-xl p-4 hover:shadow-[0_0_15px_rgba(147,51,234,0.6)] transition"
                      >
                        <p className="text-lg font-bold text-white mb-1">🎬 {film.title}</p>
                        <p className="text-sm text-gray-400 mb-2">🌐 {film.language || "N/A"}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {film.showtimes && film.showtimes.length > 0 ? (
                            film.showtimes.map((show) => (
                              <div
                                key={show._id}
                                className="px-3 py-2 rounded-lg bg-purple-800/60 text-purple-200 border border-purple-600 text-xs shadow-sm"
                              >
                                <p className="font-semibold">{show.time}</p>
                                <p>
                                  {Object.entries(show.prices)
                                    .filter(([type, price]) => price > 0)
                                    .map(([type, price]) => `${type}: ₹${price}`)
                                    .join(" | ")}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No showtimes yet.</p>
                          )}
                        </div>

                        <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">
                          ➕ Add Showtime
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No films added yet.</p>
                )}
              </div>


            </div>
          ))}
        </div>


        <div className="flex gap-6 mt-10 justify-center">
          <button className="px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-md" onClick={() => setIsAddAudiOpen(true)}>
            ➕ Add Audi
          </button>
          <button className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md">
            🎥 Add Films to Audi
          </button>
        </div>
      </div>
      {isAddAudiOpen && (
        <AddAudiForm
          theaterId={theater._id}
          onClose={() => {
            setIsAddAudiOpen(false);
            fetchTheater(); // refresh after adding
          }}
        />
      )}
    </div>
  );
}