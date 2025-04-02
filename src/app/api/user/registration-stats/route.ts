import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Function to fetch user registration statistics
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "day"; // Default to daily

    let groupByClause;
if (filter === "month") {
  groupByClause = "DATE_FORMAT(created_at, '%Y-%m')";  // Group by YYYY-MM for months
} else if (filter === "year") {
  groupByClause = "DATE_FORMAT(created_at, '%Y')";  // Group by YYYY for years
} else {
  groupByClause = "DATE(created_at)";  // Group by YYYY-MM-DD for days
}

const query = `
  SELECT 
    ${groupByClause} AS period,
    COUNT(CASE WHEN role = 'user' THEN 1 END) AS user_count,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) AS admin_count
  FROM users
  GROUP BY period
  ORDER BY period ASC;
`;

    

    // Execute the query
    const [rows] = await pool.query(query);

    console.log("Rows from database:", rows);  // Log the data returned by the query

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching user registration stats:", error);
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
  }
}
