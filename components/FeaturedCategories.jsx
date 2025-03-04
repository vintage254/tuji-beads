import React from 'react';
import Link from 'next/link';
import { AiOutlineAppstore } from 'react-icons/ai';

const FeaturedCategories = () => {
  // Categories based on our Sanity schema
  const categories = [
    {
      id: 'necklaces',
      name: 'Necklaces',
      image: '/category-necklaces.jpg',
      description: 'Elegant beaded necklaces for any occasion'
    },
    {
      id: 'bracelets',
      name: 'Bracelets',
      image: '/category-bracelets.jpg',
      description: 'Handcrafted bracelets with traditional designs'
    },
    {
      id: 'earrings',
      name: 'Earrings',
      image: '/category-earrings.jpg',
      description: 'Beautiful beaded earrings to complete your look'
    },
    {
      id: 'anklets',
      name: 'Anklets',
      image: '/category-anklets.jpg',
      description: 'Stylish anklets with unique patterns'
    },
    {
      id: 'sandals',
      name: 'Sandals',
      image: '/category-sandals.jpg',
      description: 'Comfortable beaded sandals for everyday wear'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: '/category-accessories.jpg',
      description: 'Unique accessories to enhance your style'
    }
  ];

  return (
    <div className="featured-categories">
      <div className="section-heading with-icon">
        <AiOutlineAppstore className="section-icon" />
        <h2>Shop by Category</h2>
        <p>Explore our collection by category</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            href={`/products?category=${category.id}`} 
            key={category.id}
            className="category-card"
          >
            <div 
              className="category-image" 
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-link">Shop Now</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;
