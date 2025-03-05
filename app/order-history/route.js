import { NextResponse } from 'next/server';

// This route handler will prevent Next.js from trying to statically generate this page
export async function GET() {
  return NextResponse.json(
    { message: 'This route is handled dynamically' },
    { status: 200 }
  );
}
