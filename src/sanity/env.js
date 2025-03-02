export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-02'

// Fallback values if environment variables are not available
const projectIdFallback = 'dmyl1laq'
const datasetFallback = 'beads_charm'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || datasetFallback;
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || projectIdFallback;
