// src/app/api/user/AllUsers/route.ts

import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Your MySQL pool
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string; // Include created_at field
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Query to fetch all users sorted by newest first
    const [rows] = await pool.query(
      `
        SELECT id, name, email, created_at
        FROM users
        ORDER BY created_at DESC
      `
    );

    const users = rows as User[];

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching users' }, { status: 500 });
  }
}
