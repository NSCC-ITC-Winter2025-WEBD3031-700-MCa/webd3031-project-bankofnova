import { NextResponse } from "next/server";
import pool from "@/lib/db";

// Function to fetch user registration statistics
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const filter = url.searchParams.get("filter") || "day"; // Default to daily

        let groupByClause;
        if (filter === "month") {
            groupByClause = "DATE_FORMAT(created_at, '%Y-%m')";
        } else if (filter === "year") {
            groupByClause = "YEAR(created_at)";
        } else {
            groupByClause = "DATE(created_at)";
        }

        const query = `
            SELECT ${groupByClause} AS period, COUNT(*) AS count
            FROM users
            GROUP BY period
            ORDER BY period ASC;
        `;

        const [rows] = await pool.query(query);

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching user registration stats:", error);
        return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
    }
}
