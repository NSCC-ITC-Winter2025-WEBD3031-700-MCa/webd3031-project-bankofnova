import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Delete user's bank accounts first to prevent foreign key constraint issues
    await pool.execute('DELETE FROM bank_accounts WHERE user_id = ?', [id]);

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
