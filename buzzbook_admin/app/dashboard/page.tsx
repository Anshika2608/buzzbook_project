"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import { useStats } from "@/app/context/statsContext";

const Dashboard = () => {
  const { stats, loading } = useStats();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-400">
        Loading Dashboard...
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white">
      <div className="w-64 pr-4 border-r border-gray-700">
        <Navbar />
      </div>

      <div className="flex-1 p-6 space-y-6">
       
        <h1 className="text-3xl font-bold text-purple-400">Admin Dashboard</h1>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-400">Total Movies</p>
            <h2 className="text-2xl font-bold text-purple-400">
              {stats?.totalMovies ?? 0}
            </h2>
          </div>
          <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-400">Total Theaters</p>
            <h2 className="text-2xl font-bold text-purple-400">
              {stats?.totalTheaters ?? 0}
            </h2>
          </div>
          <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-400">Total Bookings</p>
            <h2 className="text-2xl font-bold text-purple-400">
              {stats?.totalBookings ?? 0}
            </h2>
          </div>
          <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-400">Active Users</p>
            <h2 className="text-2xl font-bold text-purple-400">
              {stats?.totalUsers ?? 0}
            </h2>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-purple-400">
            Recent Bookings
          </h2>
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th>User</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Seats</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td>Anshika</td>
                <td>Oppenheimer</td>
                <td>PVR Lucknow</td>
                <td>2</td>
                <td className="text-green-400">Paid</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td>Rohit</td>
                <td>Barbie</td>
                <td>INOX Bhopal</td>
                <td>4</td>
                <td className="text-yellow-400">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts & Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              Revenue Overview
            </h2>
            <div className="h-40 flex items-center justify-center text-purple-400 font-bold text-lg">
              ₹ {stats?.totalRevenue?.toLocaleString() ?? 0}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-purple-400">
              Snacks Sold
            </h2>
            {/* <div className="h-40 flex items-center justify-center text-2xl text-purple-400 font-bold">
              {stats?.totalSnacks ?? 0}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
