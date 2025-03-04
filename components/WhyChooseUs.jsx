import React from 'react';
import { AiOutlineHeart, AiOutlineSafety, AiOutlineGift, AiOutlineShop } from 'react-icons/ai';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <AiOutlineHeart />,
      title: 'Handcrafted with Love',
      description: 'Each piece is carefully handcrafted with attention to detail and quality'
    },
    {
      id: 2,
      icon: <AiOutlineSafety />,
      title: 'Premium Materials',
      description: 'We use only the finest materials to ensure durability and beauty'
    },
    {
      id: 3,
      icon: <AiOutlineGift />,
      title: 'Perfect for Gifts',
      description: 'Our beads make thoughtful and unique gifts for any occasion'
    },
    {
      id: 4,
      icon: <AiOutlineShop />,
      title: 'Kenyan Craftsmanship',
      description: 'Supporting local artisans and traditional Kenyan craftsmanship'
    }
  ];

  return (
    <div className="why-choose-us">
      <div className="section-heading">
        <h2>Why Choose Tuji Beads</h2>
        <p>What makes our beads special</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
