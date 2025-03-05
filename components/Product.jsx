import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { urlFor } from '../lib/client';

const Product = ({ product }) => {
  if (!product) return null; // Return null if product is undefined
  
  const { image, name, slug, price } = product;
  
  // Get image URL with proper error handling
  const imageUrl = image && image[0] ? urlFor(image[0]) : '';
  
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
          <p className="product-price">KSH{price || 0}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product