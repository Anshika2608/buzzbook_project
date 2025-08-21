import React from "react";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 via-black to-gray-800">
      <div className="pr-4 border-r border-gray-700">
        <Navbar />
      </div>
      <div className="flex-1 p-6 text-purple-400">
        <h1 className="text-3xl font-bold">Dashboard Content</h1>
        <p className="mt-2 text-gray-300">
          This is where your dashboard details will go.
        </p>
        <button className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
          Action Button
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
