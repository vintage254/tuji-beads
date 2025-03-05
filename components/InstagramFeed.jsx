'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineInstagram, AiOutlineLoading3Quarters } from 'react-icons/ai';
import Link from 'next/link';
import Image from 'next/image';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Instagram account username
  const instagramUsername = 'tujibeads'; // Replace with your actual Instagram username
  
  // Fallback images in case the API fails
  const fallbackPosts = [
    {
      id: 'fallback1',
      media_url: '/instagram-1.jpg',
      permalink: 'https://instagram.com',
      caption: 'Beautiful handcrafted beads #tujibeads',
      timestamp: new Date().toISOString(),
      likes: 124,
      comments: 18,
    },
    {
      id: 'fallback2',
      media_url: '/instagram-2.jpg',
      permalink: 'https://instagram.com',
      caption: 'New collection just arrived! #beadwork',
      timestamp: new Date().toISOString(),
      likes: 89,
      comments: 12,
    },
    {
      id: 'fallback3',
      media_url: '/instagram-3.jpg',
      permalink: 'https://instagram.com',
      caption: 'Traditional Kenyan craftsmanship #handmade',
      timestamp: new Date().toISOString(),
      likes: 156,
      comments: 24,
    },
    {
      id: 'fallback4',
      media_url: '/instagram-4.jpg',
      permalink: 'https://instagram.com',
      caption: 'Perfect for any occasion #giftideas',
      timestamp: new Date().toISOString(),
      likes: 102,
      comments: 15,
    },
  ];

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch Instagram posts from our API endpoint
        const response = await fetch('/api/instagram-feed');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        
        const data = await response.json();
        
        if (data && data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        } else {
          // Use fallback posts if the API returns empty data
          setPosts(fallbackPosts);
        }
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError(err.message);
        // Use fallback posts if there's an error
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInstagramPosts();
  }, []);
  
  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="instagram-feed">
      <div className="section-heading with-icon">
        <AiOutlineInstagram className="section-icon" />
        <h2>Follow Us on Instagram</h2>
        <p>@{instagramUsername}</p>
      </div>
      
      {loading ? (
        <div className="instagram-loading">
          <AiOutlineLoading3Quarters className="loading-icon" />
          <p>Loading Instagram feed...</p>
        </div>
      ) : error ? (
        <div className="instagram-error">
          <p>Couldn't load Instagram feed. Check out our page directly!</p>
        </div>
      ) : (
        <div className="instagram-grid">
          {posts.map((post) => (
            <a 
              href={post.permalink} 
              target="_blank" 
              rel="noopener noreferrer"
              key={post.id} 
              className="instagram-post"
            >
              <div 
                className="instagram-image" 
                style={{ backgroundImage: `url(${post.media_url})` }}
              >
                <div className="instagram-overlay">
                  <div className="instagram-stats">
                    <span>{post.likes || '♥'} likes</span>
                    <span>{post.comments || '💬'} comments</span>
                    <span className="instagram-date">{formatDate(post.timestamp)}</span>
                  </div>
                </div>
              </div>
              {post.caption && (
                <div className="instagram-caption">
                  <p>{post.caption.length > 60 ? `${post.caption.substring(0, 60)}...` : post.caption}</p>
                </div>
              )}
            </a>
          ))}
        </div>
      )}
      
      <div className="instagram-follow">
        <Link href={`https://instagram.com/${instagramUsername}`} target="_blank">
          <button className="instagram-button">
            <AiOutlineInstagram />
            Follow Us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InstagramFeed;
