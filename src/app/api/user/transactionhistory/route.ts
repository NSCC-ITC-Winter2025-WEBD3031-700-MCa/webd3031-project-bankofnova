// src/app/api/user/transactionhistory/route.ts
export const dynamic = 'force-dynamic'; 

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
  sender_name?: string | null; // ← add this line

}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const accountType = url.searchParams.get('accountType');

    if (!accountType || !['chequing', 'savings'].includes(accountType)) {
      return NextResponse.json({ success: false, message: 'Invalid account type' }, { status: 400 });
    }

    // Get the correct account ID
    const [accountResult] = await pool.query(
      `SELECT id, balance FROM bank_accounts WHERE user_id = ? AND account_type = ?`,
      [userId, accountType]
    );

    const account = accountResult as { id: string; balance: number }[];

    if (!account || account.length === 0) {
      return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });
    }

    const accountId = account[0].id;
    let currentBalance = account[0].balance; // Get actual account balance

    // Get transactions ordered from OLDEST to NEWEST
    const [transactionsResult] = await pool.query(
      `SELECT 
        t.id,
        t.sender_id,
        t.sender_account_id,
        t.receiver_id,
        t.receiver_account_id,
        t.transaction_type,
        t.amount,
        t.status,
        t.created_at,
        senderUser.name AS sender_name,
        receiverUser.name AS receiver_name,
        c.nickname AS receiver_nickname
      FROM transactions t
      LEFT JOIN users senderUser ON t.sender_account_id = senderUser.id
      LEFT JOIN users receiverUser ON t.receiver_id = receiverUser.id
      LEFT JOIN user_contacts c ON c.contact_user_id = t.receiver_id AND c.user_id = ?
      WHERE t.receiver_account_id = ? OR t.sender_account_id = ?
      ORDER BY t.created_at ASC;
      `,
      [userId, accountId, accountId] 
    );

    
    

    const transactions = transactionsResult as Transaction[];

    if (transactions.length === 0) {
      return NextResponse.json({ success: true, message: 'No transactions found', transactions: [] });
    }

    const sortedTransactions = transactions.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    let runningBalance = 0; // Start from zero and build up
    const transactionsWithBalance = sortedTransactions.map((transaction, index) => {
      // Ensure the amount is parsed as a float
      const transactionAmount = parseFloat(transaction.amount);
    
      // If it's the first transaction, initialize runningBalance based on it
      if (index === 0) {
        runningBalance = transactionAmount;
      } else {
        // Modify balance based on transaction type
        if (transaction.sender_account_id === accountId) {
          runningBalance -= transactionAmount; // Deduct for sent transactions
        } else if (transaction.receiver_account_id === accountId) {
          runningBalance += transactionAmount; // Add for received transactions
        }
      }
    
      return {
        ...transaction,
        direction: transaction.sender_account_id === accountId ? 'sent' : 'received',
        amount: transactionAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        balance: runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }), // Properly formatted with commas
        sender_name: transaction.sender_name || null, // Add this line

      };
    });
    
    // Reverse back to newest first for frontend display
    transactionsWithBalance.reverse();
    


    return NextResponse.json({ success: true, transactions: transactionsWithBalance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'An error occurred while fetching transaction history' }, { status: 500 });
  }
}
