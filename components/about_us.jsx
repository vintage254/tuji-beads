import React from 'react';
import { InstagramFeed, WhyChooseUs } from './';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h1>About Tuji Beads</h1>
        <div className="about-us-description">
          <p>
            Tuji Beads is a Nairobi-based e-commerce business specializing in handcrafted beadwork, 
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
      
      <div className="about-us-team">
        <h2>Our Team</h2>
        <p>
          Behind Tuji Beads is a dedicated team of skilled artisans and designers who are passionate about 
          preserving traditional Kenyan beadwork while bringing innovative designs to the modern market.
        </p>
        <div className="team-members">
          <div className="team-member">
            <div className="team-member-image placeholder"></div>
            <h3>Jane Mwangi</h3>
            <p>Founder & Lead Designer</p>
          </div>
          <div className="team-member">
            <div className="team-member-image placeholder"></div>
            <h3>John Kamau</h3>
            <p>Master Craftsman</p>
          </div>
          <div className="team-member">
            <div className="team-member-image placeholder"></div>
            <h3>Mary Njeri</h3>
            <p>Customer Relations</p>
          </div>
        </div>
      </div>
      
      <div className="about-us-why-choose">
        <WhyChooseUs />
      </div>
      
      <div className="about-us-social">
        <h2>Follow Our Journey</h2>
        <p>Stay updated with our latest creations and behind-the-scenes moments on Instagram</p>
        <InstagramFeed />
      </div>
    </div>
  );
};

export default AboutUs;