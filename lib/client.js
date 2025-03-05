import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dmyl1laq';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'beads_charm';
const apiVersion = '2024-03-05';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  try {
    if (!source) return '';
    return builder.image(source).url();
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
};

// Create a separate client for authentication
export const authClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  withCredentials: true,
  cors: true,
  // Add CORS configuration
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});