'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Product } from './';
import { AiOutlineFire, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Link from 'next/link';

const TrendingProducts = ({ products }) => {
  // In a real app, you might have a "trending" flag in your database
  // For now, we'll just use the first few products
  const trendingProducts = useMemo(() => products?.filter(product => product.trending), [products]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [productsPerSlide, setProductsPerSlide] = useState(4);
  const carouselRef = useRef(null);
  
  // Determine how many products to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setProductsPerSlide(1);
      } else if (window.innerWidth < 900) {
        setProductsPerSlide(2);
      } else if (window.innerWidth < 1200) {
        setProductsPerSlide(3);
      } else {
        setProductsPerSlide(4);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update visible products when currentIndex or productsPerSlide changes
  useEffect(() => {
    if (trendingProducts.length > 0) {
      const endIndex = currentIndex + productsPerSlide;
      // Create a circular array by concatenating the array with itself
      const extendedProducts = [...trendingProducts, ...trendingProducts];
      setVisibleProducts(extendedProducts.slice(currentIndex, endIndex));
    }
  }, [currentIndex, productsPerSlide, trendingProducts]);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % trendingProducts.length;
      return newIndex;
    });
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? trendingProducts.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };
  
  // Auto-scroll the carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="trending-products">
      <div className="section-heading with-icon">
        <AiOutlineFire className="section-icon" />
        <h2>Trending Now</h2>
        <p>Our most popular items this season</p>
      </div>
      
      <div className="carousel-container">
        <button 
          className="carousel-button prev" 
          onClick={prevSlide}
          aria-label="Previous products"
        >
          <AiOutlineLeft />
        </button>
        
        <div className="trending-products-slider" ref={carouselRef}>
          {visibleProducts.map((product, index) => (
            <div 
              key={`${product._id}-${index}`} 
              className="trending-product-item"
            >
              <Product product={product} />
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-button next" 
          onClick={nextSlide}
          aria-label="Next products"
        >
          <AiOutlineRight />
        </button>
      </div>
      
      <div className="carousel-indicators">
        {trendingProducts.map((_, index) => (
          <button 
            key={index} 
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="view-all-container">
        <Link href="/products">
          <button className="view-all-button">View All Products</button>
        </Link>
      </div>
    </div>
  );
};

export default TrendingProducts;
