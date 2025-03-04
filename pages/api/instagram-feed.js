// This is a serverless function to fetch Instagram posts
// It uses the Instagram Basic Display API

export default async function handler(req, res) {
  // Instagram API credentials (should be stored in environment variables)
  const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;
  
  // If we don't have the required credentials, return fallback data
  if (!instagramAccessToken || !instagramUserId) {
    console.warn('Instagram credentials not found in environment variables');
    return res.status(200).json({ 
      posts: getFallbackPosts(),
      source: 'fallback'
    });
  }
  
  try {
    // Fetch media from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/${instagramUserId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${instagramAccessToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and format the posts
    const posts = data.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .slice(0, 8)  // Only take the first 8 posts
      .map(post => ({
        id: post.id,
        media_url: post.media_url,
        permalink: post.permalink,
        caption: post.caption,
        timestamp: post.timestamp,
        // Instagram Basic Display API doesn't provide likes/comments count
        // so we'll leave these fields undefined
        likes: undefined,
        comments: undefined
      }));
    
    return res.status(200).json({ 
      posts,
      source: 'instagram'
    });
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    
    // Return fallback data in case of error
    return res.status(200).json({ 
      posts: getFallbackPosts(),
      source: 'fallback'
    });
  }
}

// Fallback posts in case the Instagram API fails
function getFallbackPosts() {
  return [
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
}
