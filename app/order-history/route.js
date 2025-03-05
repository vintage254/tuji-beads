import { NextResponse } from 'next/server';

// This route handler will prevent Next.js from trying to statically generate this page
// Note: Having both route.js and page.jsx in the same folder can cause conflicts
// This file should be removed if it causes issues with the page.jsx file
export async function GET(request) {
  return NextResponse.json(
    { message: 'This route is handled dynamically' },
    { status: 200 }
  );
}
