"use client";

import React from 'react';
import { LocationProvider, useLocation } from '@/app/context/LocationContext';
import HeroCarousel from '@/components/home/Herocarousel'; 
import NowShowing from '@/components/home/NowShowing';


const HomePageContent = () => {
    const { comingSoonMovies, isLoadingComingSoon } = useLocation();
    console.log("Carousel movies in homepage:", comingSoonMovies);


    return (
        <div className="bg-gray-900 min-h-screen font-sans">
            <HeroCarousel movies={comingSoonMovies} isLoading={isLoadingComingSoon} />
            <NowShowing />

            
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