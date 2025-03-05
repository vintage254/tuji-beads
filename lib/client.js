import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Safely get environment variables with fallbacks
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dmyl1laq';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'beads_charm';
const apiVersion = '2024-03-05';
const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;

// Create client with error handling
let client;
try {
  client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
    token,
    ignoreBrowserTokenWarning: true,
  });
} catch (error) {
  console.error('Error initializing Sanity client:', error);
  // Provide a fallback client that won't crash the app
  client = {
    fetch: async () => {
      console.error('Using fallback Sanity client');
      return [];
    }
  };
}

// Create image builder with error handling
let builder;
try {
  builder = imageUrlBuilder(client);
} catch (error) {
  console.error('Error initializing image builder:', error);
  builder = {
    image: () => ({
      url: () => ''
    })
  };
}

export const urlFor = (source) => {
  try {
    if (!source) return '';
    return builder.image(source).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
};

// Create a separate client for authentication with error handling
let authClient;
try {
  authClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    withCredentials: true,
  });
} catch (error) {
  console.error('Error initializing auth client:', error);
  authClient = {
    fetch: async () => {
      console.error('Using fallback auth client');
      return [];
    }
  };
}

export { client, authClient };