/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// Fallback values if environment variables are not available
const projectIdFallback = 'dmyl1laq'
const datasetFallback = 'beads_charm'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || projectIdFallback
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || datasetFallback

export default defineCliConfig({ api: { projectId, dataset } })
