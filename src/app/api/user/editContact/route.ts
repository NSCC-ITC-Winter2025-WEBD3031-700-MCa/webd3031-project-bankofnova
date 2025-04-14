import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { contactId, nickname } = await req.json();

    if (!contactId || !nickname || nickname.trim() === '') {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `UPDATE user_contacts SET nickname = ? WHERE id = ? AND user_id = ?`,
      [nickname.trim(), contactId, session.user.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: 'Contact not found or you do not have permission' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Nickname updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
