import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className="hero-banner-container">
      <div>
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <Image 
          src={urlFor(heroBanner.image)} 
          alt={heroBanner.desc}
          width={500}
          height={500}
          className="hero-banner-image"
        />

        <div>
          <Link href="/products">
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
          <div className="desc">
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner