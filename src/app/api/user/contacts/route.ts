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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if the session is valid (i.e., user is logged in)
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); // Get email from query parameters

    // Validate that the email is provided
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // Query to fetch user by email and their associated bank accounts
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
      [email] // Use email as parameter to prevent SQL injection
    );

    const rows = queryResult[0] as any[]; // Explicitly cast to array of rows

    // If no user is found
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Recipient not found' }, { status: 404 });
    }

    // Transform the data to group bank accounts by user
    const userWithAccounts: UserWithAccounts = {
      id: rows[0].user_id,
      name: rows[0].name,
      email: rows[0].email,
      bankAccounts: rows.map(user => ({
        id: user.account_id,
        account_type: user.account_type,
      })),
    };

    // Return the user data with accounts
    return NextResponse.json({ success: true, user: userWithAccounts });
  } catch (error) {
    console.error("Error occurred while fetching user data:", error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching user' }, { status: 500 });
  }
}
