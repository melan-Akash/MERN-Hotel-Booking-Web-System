import React, { useState } from 'react';
import Title from './Title';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I cancel my booking?",
            answer: "You can cancel your booking directly from your dashboard under 'My Bookings'. Cancellation policies vary by hotel, but most bookings offer free cancellation up to 24 hours before check-in."
        },
        {
            question: "Are there any hidden fees?",
            answer: "No, we believe in complete transparency. The price you see on the checkout page is exactly what you pay. Any local resort fees or taxes will be clearly itemized before booking."
        },
        {
            question: "Can I pay at the hotel?",
            answer: "Yes, many of our partner hotels offer a 'Pay At Hotel' option. You will see this choice during checkout. A valid credit card might still be required to secure the reservation."
        }
    ];

    return (
        <div className="bg-slate-50 py-20 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12">
                {/* Left Side: Beautiful Image */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img
                        className="max-w-md w-full rounded-lg shadow-lg h-auto object-cover transform hover:scale-102 transition-transform duration-300"
                        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800"
                        alt="FAQ Support"
                    />
                </div>
                
                {/* Right Side: FAQ list */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <Title 
                        title="Frequently Asked Questions" 
                        subTitle="Have questions about bookings, payments, or cancellations? We have got you covered." 
                        align="left" 
                    />
                    
                    <div className="mt-8 space-y-2">
                        {faqs.map((faq, index) => (
                            <div 
                                className="border-b border-gray-200 py-5 cursor-pointer group" 
                                key={index} 
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-base md:text-lg text-gray-800 group-hover:text-black transition-colors font-playfair font-semibold">
                                        {faq.question}
                                    </h3>
                                    <svg 
                                        width="18" 
                                        height="18" 
                                        viewBox="0 0 18 18" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`${openIndex === index ? "rotate-180 text-black" : "text-gray-500"} transition-transform duration-500 ease-in-out`}
                                    >
                                        <path 
                                            d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" 
                                            stroke="currentColor" 
                                            strokeWidth="1.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                        />
                                    </svg>
                                </div>
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"
                                    }`}
                                >
                                    <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
