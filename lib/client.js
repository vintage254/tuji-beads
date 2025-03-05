import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-03-05', // use current date in YYYY-MM-DD format
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    withCredentials: true,
    ignoreBrowserTokenWarning: true
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
    return builder.image(source)
}