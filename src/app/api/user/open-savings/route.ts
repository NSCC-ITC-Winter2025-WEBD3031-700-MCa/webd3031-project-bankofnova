import { NextResponse } from "next/server";
import pool from "../../../../lib/db"; // MariaDB pool connection
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

// Function to generate a unique account number
const generateAccountNumber = async (): Promise<string> => {
  let accountNumber: string = "";
  let exists = true;

  while (exists) {
    accountNumber = Math.floor(10000000 + Math.random() * 90000000).toString();

    const [result]: any[] = await pool.query(
      "SELECT COUNT(*) AS count FROM bank_accounts WHERE account_number = ?",
      [accountNumber]
    );

    exists = result[0]?.count > 0;
  }

  return accountNumber;
};

export async function POST(req: Request) {
  // Fetch the session of the logged-in user
  const session = await getServerSession(authOptions);

  if (!session) {
    // If there's no session, return Unauthorized
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session?.user?.id; // Get user ID from session
    
    if (!userId) {
      return NextResponse.json({ error: 'User not found in session' }, { status: 400 });
    }

    // Generate account number for the savings account
    const accountNumber = await generateAccountNumber();

    // Insert new savings account for the user into the database
    await pool.query(
      "INSERT INTO bank_accounts (user_id, account_number, account_type) VALUES (?, ?, ?)",
      [userId, accountNumber, "savings"]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create savings account" }, { status: 500 });
  }
}
