import { client } from '../../../../lib/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const query = `*[_type == "user" && email == $email][0] {
      _id,
      _type,
      name,
      email,
      password
    }`;

    const user = await client.fetch(query, { email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' }, 
        { status: 401 }
      );
    }

    // Remove password before sending
    const { password: _, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500 }
    );
  }
}
