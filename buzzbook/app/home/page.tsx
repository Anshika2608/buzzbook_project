"use client";

import React from 'react';
import { LocationProvider, useLocation } from '@/app/context/LocationContext';
import HeroCarousel from '@/components/home/Herocarousel'; 
import NowShowing from '@/components/home/NowShowing';


const HomePageContent = () => {
    const { comingSoonMovies, isLoadingComingSoon } = useLocation();
    return (
        <div className="bg-gray-900 min-h-screen font-sans">
            <HeroCarousel movies={comingSoonMovies} isLoading={isLoadingComingSoon} />
            <NowShowing />

            
        </div>
    );
}
export default function HomePage() {
    return (
        <LocationProvider>
            <HomePageContent />
        </LocationProvider>
    );
}