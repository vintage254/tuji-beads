import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Image from 'next/image';

const Reviews = () => {
  // Sample review data (in a real app, this would come from a database)
  const reviews = [
    {
      id: 1,
      name: 'Sarah M.',
      avatar: '/review-avatar-1.png',
      rating: 5,
      date: 'February 15, 2025',
      text: 'I absolutely love the quality of these beads! The colors are vibrant and the craftsmanship is excellent. Will definitely be ordering more soon.',
    },
    {
      id: 2,
      name: 'John K.',
      avatar: '/review-avatar-2.png',
      rating: 4,
      date: 'January 28, 2025',
      text: 'The beads arrived quickly and were exactly as described. I made a beautiful bracelet for my daughter and she loves it!',
    },
    {
      id: 3,
      name: 'Amina W.',
      avatar: '/review-avatar-3.png',
      rating: 5,
      date: 'March 2, 2025',
      text: 'Tuji Beads has the best selection I\'ve found. The customer service was also excellent when I had questions about my order.',
    },
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i}>
        {i < rating ? <AiFillStar /> : <AiOutlineStar />}
      </span>
    ));
  };

  return (
    <div className="reviews-container">
      <h2>What Our Customers Say</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-avatar">
                {/* Fallback to initials if no avatar */}
                {review.avatar ? (
                  <div className="avatar-image">
                    {review.name.charAt(0)}
                  </div>
                ) : (
                  <div className="avatar-initials">
                    {review.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="reviewer-info">
                <h4>{review.name}</h4>
                <div className="review-date">{review.date}</div>
              </div>
            </div>
            <div className="review-rating">
              {renderStars(review.rating)}
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
