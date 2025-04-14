import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const [contactsResult] = await pool.query(
      `
        SELECT 
          uc.id AS contact_id,
          uc.nickname,
          u.email
        FROM user_contacts uc
        JOIN users u ON uc.contact_user_id = u.id
        WHERE uc.user_id = ?
      `,
      [session.user.id]
    );

    const contacts = (contactsResult as any[]).map(contact => ({
      id: contact.contact_id,
      nickname: contact.nickname,
      email: contact.email,
    }));

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching contacts' }, { status: 500 });
  }
}
