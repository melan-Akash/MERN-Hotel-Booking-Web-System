import React from 'react';
import Title from './Title';

const WhyChooseUs = () => {
    const features = [
        {
            title: "Best Price Guarantee",
            description: "We guarantee you the lowest possible rates for all hotel reservations.",
            icon: (
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Safe & Secure Booking",
            description: "Your transactions are encrypted and secured with top-tier protocols.",
            icon: (
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            title: "Top-Notch Amenities",
            description: "Enjoy luxury facilities including free Wi-Fi, swimming pools, and spas.",
            icon: (
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        },
        {
            title: "24/7 Customer Support",
            description: "Our dedicated support team is always ready to assist you anytime.",
            icon: (
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className='bg-white py-20 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12'>
                
                {/* Left Side: Title & Feature Grid */}
                <div className='w-full lg:w-1/2 flex flex-col'>
                    <Title 
                        title="Why Choose QuickStay" 
                        subTitle="Experience absolute peace of mind, premium quality service, and unmatched comfort with every hotel booking." 
                        align="left" 
                    />
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10'>
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className='group flex flex-col items-start p-5 bg-slate-50 hover:bg-white border border-gray-100 hover:shadow-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1'
                            >
                                <div className='p-2.5 bg-white group-hover:bg-slate-50 border border-gray-100 rounded-lg shadow-sm mb-3.5 transition-colors duration-300'>
                                    {feature.icon}
                                </div>
                                <h3 className='font-playfair text-lg font-bold text-gray-800 mb-1.5'>
                                    {feature.title}
                                </h3>
                                <p className='text-xs text-gray-500/90 leading-relaxed'>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Beautiful Hotel Image */}
                <div className='w-full lg:w-1/2 flex justify-center'>
                    <div className="relative group w-full max-w-md">
                        <img 
                            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800" 
                            alt="QuickStay Luxury Experience" 
                            className="w-full h-[450px] rounded-2xl shadow-xl object-cover transform hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent rounded-2xl" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <p className="text-xs uppercase tracking-widest font-semibold text-sky-400">Premium Choice</p>
                            <h4 className="font-playfair text-2xl font-bold mt-1">Curated Hotel Experience</h4>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WhyChooseUs;
