import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { urlFor } from '../lib/client';

const FooterBanner = ({ footerBanner }) => {
  if (!footerBanner) return null; // Return null if footerBanner is undefined
  
  const { discount, largeText1, largeText2, saleTime, smallText, midText, desc, product, buttonText, image } = footerBanner;
  
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="left">
          <p>{discount}</p>
          <h3>{largeText1}</h3>
          <h3>{largeText2}</h3>
          <p>{saleTime}</p>
        </div>
        <div className="right">
          <p>{smallText}</p>
          <h3>{midText}</h3>
          <p>{desc}</p>
          <Link href={`/product/${product}`}>
            <button type="button">{buttonText}</button>
          </Link>
        </div>

        <Image 
          src={urlFor(image)} 
          alt={desc}
          width={500}
          height={500}
          className="footer-banner-image"
        />
      </div>
    </div>
  )
}

export default FooterBanner