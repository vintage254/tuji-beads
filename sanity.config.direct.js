'use client'

/**
 * This is a direct configuration file for Sanity Studio
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Fallback values if environment variables are not available
const projectIdFallback = 'dmyl1laq'
const datasetFallback = 'beads_charm'

export default defineConfig({
  basePath: '/studio-direct',
  projectId: projectId || projectIdFallback,
  dataset: dataset || datasetFallback,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
