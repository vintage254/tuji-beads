import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { urlFor } from '../lib/client';

const Product = ({ product }) => {
  if (!product) return null; // Return null if product is undefined
  
  const { image, name, slug, price } = product;
  
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <Image 
            src={urlFor(image && image[0])}
            alt={name}
            width={250}
            height={250}
            className="product-image"
          />
          <p className="product-name">{name}</p>
          <p className="product-price">KSH{price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product