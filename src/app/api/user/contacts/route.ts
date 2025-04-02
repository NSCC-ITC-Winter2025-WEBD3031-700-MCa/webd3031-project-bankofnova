// src/app/api/user/contacts/route.ts

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // If you want to check the session, you can add logic here
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Create a query to fetch the latest 10 users along with their bank accounts
    const [rows] = await pool.query(
      `
        SELECT 
          u.id AS user_id, 
          u.name, 
          u.email, 
          ba.id AS account_id,
          ba.account_type 
        FROM users u
        LEFT JOIN bank_accounts ba ON ba.user_id = u.id
        ORDER BY u.created_at DESC
        LIMIT 10
      `
    );

    // Ensure `rows` is treated as an array
    const users = rows as any[];

    // Transform the data to group bank accounts by user
    const usersWithAccounts = users.reduce<UserWithAccounts[]>((acc, user) => {
      const { user_id, name, email, account_id, account_type } = user;

      // Check if the user already exists in the accumulator
      let userEntry = acc.find(u => u.id === user_id);

      if (!userEntry) {
        userEntry = { id: user_id, name, email, bankAccounts: [] };
        acc.push(userEntry);
      }

      if (account_id) {
        userEntry.bankAccounts.push({
          id: account_id,
          account_type,
        });
      }

      return acc;
    }, []);

    // Check if no users were found
    if (usersWithAccounts.length === 0) {
      return NextResponse.json({ success: true, message: "No users found", users: [] });
    }

    return NextResponse.json({ success: true, users: usersWithAccounts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching users' }, { status: 500 });
  }
}
