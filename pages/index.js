import React from 'react'
import { 
  HeroBanner, 
  FooterBanner, 
  Product, 
  Reviews, 
  FeaturedCategories,
  WhyChooseUs,
  TrendingProducts,
  Newsletter,
  InstagramFeed
} from '../components'

import { client } from '../lib/client';
import Link from 'next/link';

const Home = ({ products, bannerData }) => {
  return (
    <div className="home-container">
      {/* Hero Banner */}
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      
      {/* Why Choose Us Section */}
      <section className="home-section">
        <WhyChooseUs />
      </section>
      
    
      
      {/* Trending Products */}
      <section className="home-section">
        <TrendingProducts products={products} />
      </section>
      
      {/* Best Selling Products */}
      <section className="home-section alt-bg">
        <div className='products-heading'>
          <h2>Best Selling Products</h2>
          <p>Beads of various shapes, sizes, and colors</p>
        </div>

        <div className='products-container'>
          {products?.slice(0, 4).map((product) => <Product key={product._id} product={product} />)}
        </div>
        
        <div className="view-all-container">
          <Link href="/products">
            <button className="view-all-button">View All Products</button>
          </Link>
        </div>
      </section>
      
      {/* Customer Reviews */}
      <section className="home-section">
        <Reviews />
      </section>
      
      {/* Instagram Feed */}
      <section className="home-section alt-bg">
        <InstagramFeed />
      </section>
      
      {/* Newsletter */}
      <section className="home-section">
        <Newsletter />
      </section>
      
      {/* Footer Banner */}
      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>

  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  }
}
export default Home