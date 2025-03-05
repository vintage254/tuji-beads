// This file helps Next.js understand which routes should be statically generated

export async function generateStaticParams() {
  // Only generate static params for the home page and other safe pages
  // Explicitly exclude order-history and other problematic routes
  return [
    { path: [''] }, // Home page
    { path: ['product'] }, // Product listing page
    // Add other safe routes here
  ];
}
