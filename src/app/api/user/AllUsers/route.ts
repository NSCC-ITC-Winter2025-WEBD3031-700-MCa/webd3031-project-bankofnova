
export const dynamic = 'force-dynamic'; 

import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Your MySQL pool
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string; // Include created_at field
  role: string; // Include role field
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Query to fetch all users along with their roles
    const [rows] = await pool.query(
      `SELECT id, name, email, created_at, role
       FROM users
       ORDER BY created_at DESC`
    );

    const users = rows as User[];

    // Count users and admins
    const userCount = users.length;
    const adminCount = users.filter(user => user.role === 'admin').length;

    return NextResponse.json({ success: true, users, userCount, adminCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching users' }, { status: 500 });
  }
}
