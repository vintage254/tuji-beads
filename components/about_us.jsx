import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h1>About Beads Charm</h1>
        <div className="about-us-description">
          <p>
            Beads Charm is a Nairobi-based e-commerce business specializing in handcrafted beadwork, 
            offering a unique selection of handmade jewelry, sandals, and accessories.
          </p>
          <p>
            With over three years of experience, we take pride in preserving traditional craftsmanship 
            while delivering high-quality, stylish, and culturally inspired products.
          </p>
          <p>
            Our creations celebrate artistry and authenticity, serving customers in Nairobi and its 
            surrounding areas with elegant, handcrafted bead designs that blend tradition with modern fashion.
          </p>
        </div>
      </div>
      
      <div className="about-us-mission">
        <h2>Our Mission</h2>
        <p>
          To preserve and promote traditional beadwork craftsmanship while providing our customers with 
          unique, high-quality products that tell a story and connect them to rich cultural heritage.
        </p>
      </div>
      
      <div className="about-us-values">
        <h2>Our Values</h2>
        <ul>
          <li><strong>Quality:</strong> We use only the finest materials and techniques in our creations.</li>
          <li><strong>Authenticity:</strong> Each piece reflects genuine traditional craftsmanship.</li>
          <li><strong>Sustainability:</strong> We support ethical sourcing and production methods.</li>
          <li><strong>Community:</strong> We empower local artisans and preserve cultural heritage.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;