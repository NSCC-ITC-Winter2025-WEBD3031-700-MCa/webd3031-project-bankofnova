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

    if (session.user.role === "admin") {
      return jsonResponse({ error: "Admins do not have a balance" }, 403);
    }

    const userId = session.user.id;

    // Query the balance
    const [account] = await pool.query<mysql.RowDataPacket[]>(
      "SELECT balance FROM bank_accounts WHERE user_id = ?",
      [userId]
    );

    if (!account?.length) {
      return jsonResponse({ error: "Bank account not found" }, 404);
    }

    return jsonResponse({ balance: account[0].balance }, 200);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
