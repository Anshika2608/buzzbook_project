"use client";

import React from 'react';

// Assuming your files are at these paths, please adjust if they are different
import { LocationProvider, useLocation } from '@/app/context/LocationContext';
import HeroCarousel from '@/components/home/Herocarousel'; // This imports YOUR carousel component


// --- Main Page Layout ---
// This is the core content of your homepage. It uses the data from the context.
const HomePageContent = () => {
    const { comingSoonMovies, isLoadingComingSoon } = useLocation();
    console.log("Carousel movies in homepage:", comingSoonMovies);


    return (
        <div className="bg-gray-900 min-h-screen font-sans">
            {/* Renders YOUR HeroCarousel component, passing the required data. */}
            <HeroCarousel movies={comingSoonMovies} isLoading={isLoadingComingSoon} />
            
        </div>
    );
}

// --- Final Export ---
// This wraps the entire page with the LocationProvider.
// This is essential so that HomePageContent and HeroCarousel can both use the `useLocation` hook to get data.
export default function HomePage() {
    return (
        <LocationProvider>
            <HomePageContent />
        </LocationProvider>
    );
}