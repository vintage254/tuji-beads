'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config.direct';

export default function StudioDirectPage() {
  return (
    <NextStudio config={config} />
  );
} 