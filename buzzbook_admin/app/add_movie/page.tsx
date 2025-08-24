"use client";

import React from "react";
import AddMovieForm from "@/components/forms/addMovieForm";

const AddMoviePage = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-black to-gray-800 min-h-screen min-w-full">
      <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>
      <AddMovieForm />
    </div>
  );
};

export default AddMoviePage;
