"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

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
  audis: {
    audi_number: string;
    layout_type: string;
    rows: number;
    seatsPerRow: number;
    seating_capacity: number;
  }[];
};

export default function TheaterDetailsPage() {
  const params = useParams();
  const theaterId = params?.id as string; 
  const [theater, setTheater] = useState<Theater | null>(null);

  useEffect(() => {
    if (theaterId) {
      axios
        .get(`https://buzzbook-server-dy0q.onrender.com/theater/${theaterId}`)
        .then((res) => setTheater(res.data))
        .catch((err) => console.error(err));
    }
  }, [theaterId]);

  if (!theater) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-4">{theater.name}</h1>
      <p className="text-gray-700">
        <strong>Address:</strong> {theater.address}
      </p>
      <p className="text-gray-700">
        <strong>Contact:</strong> {theater.contact}
      </p>
      <p className="text-gray-700">
        <strong>Location:</strong> {theater.location.city},{" "}
        {theater.location.state}, {theater.location.country}
      </p>
      <p className="text-gray-700">
        <strong>Popular:</strong> {theater.popular ? "Yes" : "No"}
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Audis</h2>
      {theater.audis.map((audi, index) => (
        <div
          key={index}
          className="p-3 mb-3 border rounded-lg bg-gray-50 shadow-sm"
        >
          <p>
            <strong>Audi Number:</strong> {audi.audi_number}
          </p>
          <p>
            <strong>Layout:</strong> {audi.layout_type}
          </p>
          <p>
            <strong>Rows:</strong> {audi.rows}
          </p>
          <p>
            <strong>Seats per Row:</strong> {audi.seatsPerRow}
          </p>
          <p>
            <strong>Total Capacity:</strong> {audi.seating_capacity}
          </p>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Audi
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Add Films to Audi
        </button>
      </div>
    </div>
  );
}
