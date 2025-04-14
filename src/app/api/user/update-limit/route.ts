import { NextRequest } from "next/server";
import pool from "../../../../lib/db"; // Assuming you're using a connection pool for MariaDB
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth"; // Ensure correct path
import { NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  // Get session data
  const session = await getServerSession(authOptions);

  // Check if the user is logged in
  if (!session) {
    return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
  }

  // Log the session data for debugging
  console.log("Session Data:", session);

  // Parse the body of the request
  const { employerId, withdrawalLimit } = await req.json(); // Use req.json() to parse the request body

  // Log the received data for debugging
  console.log("Received data:", employerId, withdrawalLimit);

  // Validate input
  if (typeof employerId !== "number" || typeof withdrawalLimit !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    // Check if the user-employer relationship exists
    const [rows]: any[] = await pool.query(
      "SELECT * FROM user_employer WHERE user_id = ? AND employer_id = ?",
      [session.user.id, employerId]
    );

    console.log("User-Employer Relationship Found:", rows);

    if (rows.length === 0) {
      // If no relationship is found, insert a new one
      const [insertResult]: any = await pool.query(
        "INSERT INTO user_employer (user_id, employer_id, withdrawal_limit) VALUES (?, ?, ?)",
        [session.user.id, employerId, withdrawalLimit]
      );

      // Checking the affectedRows property of the insert result
      if (insertResult.affectedRows > 0) {
        return NextResponse.json({ message: "User-employer relationship created and withdrawal limit set." });
      } else {
        return NextResponse.json({ error: "Failed to create user-employer relationship." }, { status: 500 });
      }
    }

    // If the relationship exists, update the withdrawal limit
    const [updateResult]: any = await pool.query(
      "UPDATE user_employer SET withdrawal_limit = ? WHERE user_id = ? AND employer_id = ?",
      [withdrawalLimit, session.user.id, employerId]
    );

    // Check if any rows were affected by the update
    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ error: "No rows updated, possibly no changes made." }, { status: 400 });
    }

    return NextResponse.json({ message: "Withdrawal limit updated successfully" });
  } catch (err) {
    console.error("Error while updating withdrawal limit:", err);
    return NextResponse.json({ error: "Failed to update withdrawal limit" }, { status: 500 });
  }
}
