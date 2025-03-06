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

        <div className="footer-banner-image-container">
          <Image 
            src={urlFor(image)} 
            alt={desc}
            width={500}
            height={500}
            className="footer-banner-image"
          />
        </div>
      </div>
      
      <style jsx>{`
        .footer-banner-container {
          padding: 100px 40px;
          background-color: #f02d34;
          border-radius: 15px;
          position: relative;
          height: 400px;
          line-height: 1; 
          color: white;
          width: 100%;
          margin-top: 120px;
        }
        
        .banner-desc {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        
        .banner-desc .left {
          flex: 1;
          max-width: 300px;
        }
        
        .banner-desc .left h3 {
          font-weight: 900;
          font-size: 80px;
          margin-left: 25px;
        }
        
        .banner-desc .right {
          flex: 1;
          max-width: 300px;
          line-height: 1.4;
        }
        
        .banner-desc .right h3 {
          font-weight: 800;
          font-size: 60px;
        }
        
        .banner-desc .right p {
          font-size: 18px;
        }
        
        .banner-desc .right button {
          border-radius: 15px;
          padding: 10px 16px;
          background-color: white;
          color: red;
          border: none;
          margin-top: 40px;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .footer-banner-image-container {
          position: absolute;
          top: -25%;
          left: 25%;
          z-index: 1;
        }
        
        .footer-banner-image {
          width: 450px;
          height: 450px;
        }
        
        @media screen and (max-width: 1100px) {
          .banner-desc .left h3,
          .banner-desc .right h3 {
            font-size: 60px;
          }
          
          .footer-banner-image {
            width: 350px;
            height: 350px;
          }
        }
        
        @media screen and (max-width: 768px) {
          .footer-banner-container {
            height: auto;
            padding: 40px 20px;
            margin-top: 80px;
          }
          
          .banner-desc {
            flex-direction: column;
            text-align: center;
          }
          
          .banner-desc .left,
          .banner-desc .right {
            max-width: 100%;
            margin: 0 auto;
          }
          
          .banner-desc .left h3,
          .banner-desc .right h3 {
            font-size: 40px;
            margin-left: 0;
          }
          
          .banner-desc .right {
            margin-top: 30px;
          }
          
          .footer-banner-image-container {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 30px;
          }
          
          .footer-banner-image {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  )
}

export default FooterBanner