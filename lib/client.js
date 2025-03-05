import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  withCredentials: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  try {
    if (!source) return '';
    return builder.image(source);
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '';
  }
};