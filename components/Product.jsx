import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';

const Product = ({ product }) => {
  if (!product) return null; // Return null if product is undefined
  
  const { currency, convertPrice, isLoadingExchangeRate } = useStateContext();
  const { image, name, slug, price, negotiable } = product;
  
  // Get image URL with proper error handling
  const imageUrl = image && image[0] ? urlFor(image[0]) : '';
  
  // Display price based on selected currency
  const displayPrice = () => {
    if (isLoadingExchangeRate) {
      return <span className="loading-price">Loading...</span>;
    }
    
    if (!price && price !== 0) {
      return <span>{currency === 'USD' ? '$0.00' : 'KSh 0.00'}</span>;
    }
    
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return <span>{currency === 'USD' ? '$0.00' : 'KSh 0.00'}</span>;
    }
    
    if (currency === 'USD') {
      const convertedPrice = convertPrice(numericPrice);
      return <span>${convertedPrice}</span>;
    }
    
    return <span>KSh {numericPrice.toFixed(2)}</span>;
  };
  
  return (
    <div>
      <Link href={`/product/${slug?.current || ''}`}>
        <div className="product-card">
          {imageUrl ? (
            <Image 
              src={imageUrl}
              alt={name || 'Product Image'}
              width={250}
              height={250}
              className="product-image"
            />
          ) : (
            <div className="product-image-placeholder">No Image Available</div>
          )}
          <p className="product-name">{name || 'Unnamed Product'}</p>
          <div className="product-price-container">
            <p className="product-price">{displayPrice()}</p>
            {negotiable && (
              <span className="product-negotiable-badge">Negotiable</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Product