import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from '../components/Testimonial '
import NewsLetter from '../components/NewsLetter'
import RecommendedHotels from '../components/RecommendedHotels'
import WhyChooseUs from '../components/WhyChooseUs'
import FAQ from '../components/FAQ'

const Home = () => {


    return (
        <>
            <Hero />
            <RecommendedHotels />
            <FeaturedDestination />
            <ExclusiveOffers />
            <WhyChooseUs />
            <Testimonial />
            <FAQ />
            <NewsLetter/>
        </>
    )
}

export default Home