import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-03-05', // use current date in YYYY-MM-DD format
    useCdn: false, // Disabled because we're using credentials
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    withCredentials: false, // Changed to false since we're using token auth
    ignoreBrowserTokenWarning: true
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
    if (!source) return '';
    try {
        return builder.image(source).url();
    } catch (error) {
        console.error('Error generating image URL:', error);
        return '';
    }
}