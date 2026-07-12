import React from 'react';
import Title from './Title';

const Testimonial = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Emma Rodriguez',
            handle: '@emmatravels',
            date: 'April 20, 2026',
            text: "QuickStay made booking our honeymoon in Mirissa an absolute breeze. Highly recommend their services!"
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Liam Johnson',
            handle: '@liamj_adventures',
            date: 'May 10, 2026',
            text: "The best hotel rates and cleanest interfaces I've ever experienced. 10/10 booking customer experience!"
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Sophia Lee',
            handle: '@sophia_lee',
            date: 'June 5, 2026',
            text: "Incredible selection of premium villas and cabins. The customer support resolved my queries instantly!"
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Oliver',
            handle: '@jordan_explores',
            date: 'July 11, 2026',
            text: "Booking with QuickStay was secure, seamless, and hassle-free. Absolutely loving the premium user interface!"
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-5 rounded-xl mx-4 bg-white border border-gray-100 shadow hover:shadow-lg transition-all duration-200 w-80 shrink-0">
            <div className="flex gap-2.5">
                <img className="w-11 h-11 rounded-full object-cover" src={card.image} alt="User Image" />
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1">
                        <p className="font-playfair font-semibold text-gray-800 text-sm">{card.name}</p>
                        <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#2196F3" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500 font-light">{card.handle}</span>
                </div>
            </div>
            <p className="text-sm py-4 text-gray-700 leading-relaxed font-light">"{card.text}"</p>
            <div className="flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center gap-1.5">
                    <span>Posted on</span>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z" fill="currentColor" />
                        </svg>
                    </a>
                </div>
                <p>{card.date}</p>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col items-center bg-slate-50 py-20 w-full overflow-hidden'>
            <Title title="What Our Guests Say" subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world." />
            
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 28s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative mt-16">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] py-4">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative mt-4">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent"></div>
            </div>
        </div>
    );
};

export default Testimonial;