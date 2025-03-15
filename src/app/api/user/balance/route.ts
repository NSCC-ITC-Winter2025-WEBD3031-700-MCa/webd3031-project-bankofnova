import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import pool from "../../../../lib/db";
import mysql from "mysql2/promise";
import { authOptions } from "../../../../auth";

// Helper function for sending JSON responses
const jsonResponse = (data: object, status: number) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return jsonResponse({ error: "Not authenticated" }, 401);
    }

    const userId = session.user.id;  // Using session user ID directly
    const [accounts] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT account_type, balance 
       FROM bank_accounts 
       WHERE user_id = ?`,
      [userId]
    );

    if (!accounts.length) {
      return jsonResponse({ error: "Bank accounts not found" }, 404);
    }

    // Format response to include both chequing and savings balances
    const balances = accounts.reduce((acc, account) => {
      acc[account.account_type] = account.balance;
      return acc;
    }, {} as Record<string, number>);

    return jsonResponse({ balances }, 200);
  } catch (error) {
    console.error("Error fetching balances:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
