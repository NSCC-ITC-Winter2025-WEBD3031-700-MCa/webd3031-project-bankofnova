import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming you have the DB pool for querying
import { getServerSession } from "next-auth"; // Session management from NextAuth
import { authOptions } from "@/auth"; // Your AuthOptions

// Debugging: Check user session
console.log("Auth options:", authOptions);

export async function GET() {
  try {
    const session = await getServerSession(authOptions); // Get the user session

    if (!session || !session.user?.email) {
      console.log("Unauthorized access attempt"); // Debugging: Session check failed
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Debugging: Log the session
    console.log("Session Data:", session);

    // Query the database to get user's integration data (GitHub and Google)
    const [rows] = await pool.query(
      `SELECT github_id, google_id FROM users WHERE email = ? LIMIT 1`,
      [session.user.email]
    );

    // Debugging: Log the response from the database query
    console.log("Database query result:", rows);

    if ((rows as any[]).length === 0) {
      console.log("User not found in database"); // Debugging: No user found
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const user = (rows as any[])[0]; // Extract user data

    // Determine if the user has linked GitHub or Google
    const integrations = {
      githubLinked: user.github_id !== null,
      googleLinked: user.google_id !== null,
    };

    // Debugging: Log the integration status
    console.log("Integration Status:", integrations);

    return NextResponse.json({
      success: true,
      data: integrations, // Return integration status
    });
  } catch (error) {
    console.error("Error fetching integration data:", error); // Debugging: Error logging
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
