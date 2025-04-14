import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json({ success: false, message: 'Contact ID is required' }, { status: 400 });
    }

    // Delete contact where user_id is current user and contact id matches
    const [result] = await pool.query(
      `DELETE FROM user_contacts WHERE id = ? AND user_id = ?`,
      [contactId, session.user.id]
    );

    return NextResponse.json({ success: true, message: 'Contact removed successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while deleting contact' }, { status: 500 });
  }
}
