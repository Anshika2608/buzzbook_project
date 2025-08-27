"use client";
import React, { useState, useMemo } from "react";
import { useTheaters } from "@/app/context/theaterContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const TheaterPage: React.FC = () => {
    const { theaters, loading, error } = useTheaters();
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    // Extract unique locations
    const locations = useMemo(() => {
        const uniqueLocations = new Set(
            theaters.map(
                (t) => `${t.location.city}, ${t.location.state}, ${t.location.country}`
            )
        );
        return Array.from(uniqueLocations);
    }, [theaters]);

    // Filter theaters by location
    const filteredTheaters = useMemo(() => {
        if (!selectedLocation) return theaters;
        return theaters.filter(
            (t) =>
                `${t.location.city}, ${t.location.state}, ${t.location.country}` ===
                selectedLocation
        );
    }, [selectedLocation, theaters]);

    if (loading)
        return (
            <p className="text-center text-lg text-purple-400">Loading theaters...</p>
        );
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-6 ">
            <div className="relative flex items-center mb-6">
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-purple-400">
                    🎬 All Theaters
                </h1>

                <div className="ml-auto">
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="bg-gray-800 text-white border border-purple-500 rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">🌍 All Locations</option>
                        {locations.map((loc, idx) => (
                            <option key={idx} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>
            </div>



            {filteredTheaters.length === 0 ? (
                <p className="text-center text-gray-400">No theaters available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTheaters.map((theater) => (
                        <Card
                            key={theater._id}
                            className="bg-gray-800 border border-purple-600 rounded-2xl shadow-lg hover:shadow-purple-700 transition duration-300"
                        >
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <h2 className="text-xl font-semibold text-purple-300">
                                        {theater.name}
                                    </h2>
                                    <p className="text-gray-400">{theater.address}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        📍 {theater.location.city}, {theater.location.state},{" "}
                                        {theater.location.country}
                                    </p>

                                    <p className="text-sm mt-3 text-gray-500">
                                        Contact:{" "}
                                        <span className="font-medium text-purple-200">
                                            {theater.contact}
                                        </span>
                                    </p>
                                    <p className="text-sm mt-1 text-gray-500">
                                        Popular:{" "}
                                        <span
                                            className={
                                                theater.popular
                                                    ? "text-green-400 font-medium"
                                                    : "text-gray-500"
                                            }
                                        >
                                            {theater.popular ? "Yes" : "No"}
                                        </span>
                                    </p>

                                    <p className="text-sm mt-2 text-gray-500">
                                        🎬 Audis:{" "}
                                        <span className="font-medium text-purple-300">
                                            {theater.audis.length}
                                        </span>
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 mt-5">
                                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg cursor-pointer">
                                        <Link href={`/theater/${theater._id}`}>👁 View</Link>
                                    </Button>
                                    <Button className="flex-1 bg-slate-600 text-white px-4 py-2  hover:bg-slate-700 font-semibold rounded-lg cursor-pointer">
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TheaterPage;
