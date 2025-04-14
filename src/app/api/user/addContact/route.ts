export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Your MySQL pool
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

interface BankAccount {
  id: string;
  account_type: string;
}

interface UserWithAccounts {
  id: string;
  name: string;
  email: string;
  bankAccounts: BankAccount[];
}

// GET: Fetch user and accounts by email
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const queryResult = await pool.query(
      `
        SELECT 
          u.id AS user_id, 
          u.name, 
          u.email, 
          ba.id AS account_id,
          ba.account_type 
        FROM users u
        LEFT JOIN bank_accounts ba ON ba.user_id = u.id
        WHERE u.email = ?
      `,
      [email]
    );

    const rows = queryResult[0] as any[];

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Recipient not found' }, { status: 404 });
    }

    const userWithAccounts: UserWithAccounts = {
      id: rows[0].user_id,
      name: rows[0].name,
      email: rows[0].email,
      bankAccounts: rows.map(user => ({
        id: user.account_id,
        account_type: user.account_type,
      })),
    };

    return NextResponse.json({ success: true, user: userWithAccounts });
  } catch (error) {
    console.error("Error occurred while fetching user data:", error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching user' }, { status: 500 });
  }
}

// POST: Add a new contact for the logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { email, nickname } = await req.json();

    if (!email || !nickname) {
      return NextResponse.json({ success: false, message: 'Email and nickname are required' }, { status: 400 });
    }

    // Fetch user by email to get contact_user_id
    const [userResult] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    );

    const userRows = userResult as any[];

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const contactUserId = userRows[0].id;

    // Prevent adding yourself as a contact
    if (contactUserId === session.user.id) {
      return NextResponse.json({ success: false, message: "You can't add yourself as a contact." }, { status: 400 });
    }

    // Insert contact relationship with nickname
    await pool.query(
      `
        INSERT INTO user_contacts (user_id, contact_user_id, nickname)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          nickname = VALUES(nickname),
          created_at = CURRENT_TIMESTAMP
      `,
      [session.user.id, contactUserId, nickname]
    );

    return NextResponse.json({ success: true, message: 'Contact added successfully' });
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json({ success: false, message: 'An error occurred while adding contact' }, { status: 500 });
  }
}
