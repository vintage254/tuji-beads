// This file helps Next.js understand which routes should be statically generated

export async function generateStaticParams() {
  // Only generate static params for the home page and other safe pages
  // Explicitly exclude order-history and other problematic routes
  return [
    { slug: '' }, // Home page
    { slug: 'product' }, // Product listing page
    // Add other safe routes here
  ];
}
