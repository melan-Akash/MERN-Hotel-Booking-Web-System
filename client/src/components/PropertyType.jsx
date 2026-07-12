import React, { useState } from 'react';
import Title from './Title';
import { useAppContext } from '../context/AppContext';

const PropertyType = () => {
    const { navigate } = useAppContext();
    const [stopScroll, setStopScroll] = useState(false);

    const categories = [
        {
            name: "Hotels",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
        },
        {
            name: "Luxury Resorts",
            image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600",
        },
        {
            name: "Villas",
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600",
        },
        {
            name: "Cabins",
            image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600",
        },
        {
            name: "Beachfront Houses",
            image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600",
        }
    ];

    const handleCategoryClick = (categoryName) => {
        navigate(`/rooms?propertyType=${encodeURIComponent(categoryName)}`);
        scrollTo(0, 0);
    };

    return (
        <div className='flex flex-col items-center bg-white py-20 w-full overflow-hidden'>
            <Title 
                title="Browse by Property Type" 
                subTitle="Explore different types of accommodations to find your ideal stay, tailored to your exact travel preferences." 
            />
            
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }

                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>

            <div 
                className="overflow-hidden w-full relative max-w-6xl mx-auto mt-16" 
                onMouseEnter={() => setStopScroll(true)} 
                onMouseLeave={() => setStopScroll(false)}
            >
                {/* Fade overlays */}
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                
                {/* Scrolling container */}
                <div 
                    className="marquee-inner flex w-fit" 
                    style={{ 
                        animationPlayState: stopScroll ? "paused" : "running", 
                        animationDuration: categories.length * 4000 + "ms" 
                    }}
                >
                    <div className="flex">
                        {[...categories, ...categories].map((category, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleCategoryClick(category.name)}
                                className="w-64 mx-4 h-[24rem] relative group hover:scale-95 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
                            >
                                <img 
                                    src={category.image} 
                                    alt={category.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    loading="lazy"
                                />
                                <div className="flex flex-col items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0 backdrop-blur-sm bg-black/30">
                                    <p className="text-white text-xl font-playfair font-bold text-center">{category.name}</p>
                                    <span className="text-xs text-sky-400 mt-2 font-medium tracking-wider uppercase">View Properties</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            </div>
        </div>
    );
};

export default PropertyType;
