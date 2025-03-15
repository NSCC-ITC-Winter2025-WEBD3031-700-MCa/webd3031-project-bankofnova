import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import pool from "../../../lib/db";
import mysql from "mysql2/promise";
import { authOptions } from "../../../auth";

// Helper function for sending JSON responses
const jsonResponse = (data: object, status: number) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return jsonResponse({ error: "Not authenticated" }, 401);
    }

    // Fetch the email from the query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return jsonResponse({ error: "Email is required" }, 400);
    }

    // Query the recipient by email
    const [recipientRows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT id, name, email 
       FROM users 
       WHERE email = ?`,
      [email]
    );

    if (!recipientRows.length) {
      return jsonResponse({ error: "Recipient not found" }, 404);
    }

    // Return the recipient data
    const recipient = recipientRows[0];
    return jsonResponse({ recipient }, 200);
  } catch (error) {
    console.error("Error fetching recipient:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
}
