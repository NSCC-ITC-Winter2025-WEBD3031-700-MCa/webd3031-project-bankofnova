// src/app/api/user/transactionhistory/route.ts

import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Your MySQL pool
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth';

interface Transaction {
  id: string;
  sender_id: string | null;
  sender_account_id: string | null;
  receiver_id: string;
  receiver_account_id: string;
  transaction_type: string;
  amount: string;
  status: string;
  created_at: string;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id; // Assuming user ID is available in session
    const url = new URL(req.url);
    const accountType = url.searchParams.get('accountType'); // Get account type from query parameter (chequing or savings)

    // Ensure the account type is valid
    if (!accountType || !['chequing', 'savings'].includes(accountType)) {
      return NextResponse.json({ success: false, message: 'Invalid account type' }, { status: 400 });
    }

    // Fetch the corresponding account ID based on the account type
    const [accountResult] = await pool.query(
      `SELECT id FROM bank_accounts WHERE user_id = ? AND account_type = ?`,
      [userId, accountType]
    );

    const account = accountResult as { id: string }[]; // Cast result to expected type

    if (!account || account.length === 0) {
      return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });
    }

    const accountId = account[0].id;

    // Query to fetch transactions for the specified account
    const [transactionsResult] = await pool.query(
      `
        SELECT 
          t.id,
          t.sender_id,
          t.sender_account_id,
          t.receiver_id,
          t.receiver_account_id,
          t.transaction_type,
          t.amount,
          t.status,
          t.created_at
        FROM transactions t
        WHERE t.receiver_account_id = ? OR t.sender_account_id = ?
        ORDER BY t.created_at DESC
        LIMIT 10
      `,
      [accountId, accountId]
    );

    const transactions = transactionsResult as Transaction[]; // Type assertion for rows

    // Add a `direction` property to each transaction
    const transactionsWithDirection = transactions.map((transaction) => ({
      ...transaction,
      direction: transaction.sender_account_id === accountId ? 'sent' : 'received',
    }));

    if (transactionsWithDirection.length === 0) {
      return NextResponse.json({ success: true, message: 'No transactions found', transactions: [] });
    }

    return NextResponse.json({ success: true, transactions: transactionsWithDirection });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching transaction history' }, { status: 500 });
  }
}
