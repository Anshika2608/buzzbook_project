"use client";

import React, { useState, useEffect } from 'react';
// It only needs to know about the simplified movie type
import { CarouselMovie } from '@/app/types/movie';

interface HeroCarouselProps {
    movies: CarouselMovie[];
    isLoading: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies, isLoading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if(movies.length > 1) {
            const slider = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % movies.length);
            }, 5000);
            return () => clearInterval(slider);
        }
    }, [movies.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? movies.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === movies.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    if (isLoading) {
        return <div className="w-full h-screen bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div></div>;
    }

    if (!movies || movies.length === 0) {
        return <div className="w-full h-screen bg-gray-900 flex items-center justify-center text-white text-2xl font-semibold">No upcoming movies to show.</div>;
    }
    
    const currentMovie = movies[currentIndex];

    return (
        <div className="relative w-full h-screen bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${currentMovie.poster})` }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-8 sm:px-12">
                <div className="max-w-xl">
                    <p className="text-purple-400 font-semibold tracking-wider text-sm sm:text-base">EXCLUSIVE SHOW (COMING SOON)</p>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold my-4 leading-tight">{currentMovie.title}</h1>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">{currentMovie.description}</p>
                    <p className="font-semibold text-gray-400 mb-8">Releasing: {formatDate(currentMovie.releaseDate)}</p>
                    <div className="flex items-center gap-4">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">Watch Trailer</button>
                    </div>
                </div>
            </div>

            <button onClick={goToPrevious} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/50 hover:text-white transition z-20 text-4xl">&lt;</button>
            <button onClick={goToNext} className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/50 hover:text-white transition z-20 text-4xl">&gt;</button>

            {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {movies.map((_, index) => <div key={index} className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-purple-500' : 'bg-white/50'}`}></div>)}
            </div> */}
        </div>
    );
};

export default HeroCarousel;
