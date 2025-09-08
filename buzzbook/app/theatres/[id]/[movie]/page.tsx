"use client"
import { useLocation } from '@/app/context/LocationContext'
import React from 'react'
import { useEffect } from 'react'
export default function TheatrePage() {
const {city,movieDet,fetchTheatres,theatres} = useLocation();
  const movieName = movieDet?.title;
useEffect(()=>{
  if(city&&movieName){
    fetchTheatres(movieName,city);
  }
},[movieName,city]);
  return (
   <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Theatres in {city} showing {movieName}
      </h1>

      {theatres.length === 0 ? (
        <p className="text-gray-500">No theatres found.</p>
      ) : (
        <ul className="space-y-3">
          {theatres.map((theatre) => (
            <li
              key={theatre._id}
              className="p-4 border rounded-lg bg-gray-900 text-gray-200"
            >
              <h2 className="font-semibold text-lg">{theatre.name}</h2>
              <h2>{theatre.address}</h2>
              <h2>{theatre.contact}</h2>
              {/* <p className="text-sm text-gray-400">{theatre.location}</p>
              {theatre.screens && (
                <p className="text-sm text-gray-500">
                  Screens: {theatre.screens.length}
                </p>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

