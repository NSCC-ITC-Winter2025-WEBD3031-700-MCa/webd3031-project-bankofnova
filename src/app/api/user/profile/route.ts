import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import bcrypt from 'bcryptjs';

// GET: Fetch name, email (not password for security)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await pool.query(
      `SELECT name, email FROM users WHERE email = ? LIMIT 1`,
      [session.user.email]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const user = (rows as any[])[0];

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update name, email, and optionally password
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Update fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      updateValues.push(hashed);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(session.user.email); // For WHERE clause

    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE email = ?`,
      updateValues
    );

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
