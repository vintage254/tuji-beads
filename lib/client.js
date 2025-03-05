import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-05',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  withCredentials: false,
  ignoreBrowserTokenWarning: true
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