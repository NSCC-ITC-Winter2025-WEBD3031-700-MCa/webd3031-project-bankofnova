import { NextResponse } from "next/server";
import pool from "../../../../lib/db"; // MariaDB pool connection
import bcrypt from "bcryptjs";

// Function to generate a unique 8-digit account number
const generateAccountNumber = async (): Promise<string> => {
    const [result]: any[] = await pool.query(
        "SELECT MAX(CAST(account_number AS UNSIGNED)) AS max_account_number FROM bank_accounts"
    );
    const maxAccountNumber = result[0].max_account_number || 11110000; // Starting point
    const newAccountNumber = (maxAccountNumber + 1).toString().padStart(8, '0'); // Ensures 8 digits
    return newAccountNumber;
};

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Check if user already exists
        const [existingUser]: any[] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser && existingUser.length > 0) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const [userResult]: any[] = await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, "user"]
        );

        // Generate a unique account number for the user
        const accountNumber = await generateAccountNumber();

        // Insert new bank account for the user
        await pool.query(
            "INSERT INTO bank_accounts (user_id, account_number, account_type) VALUES (?, ?, ?)",
            [userResult.insertId, accountNumber, "chequing"]
        );

        return NextResponse.json({ message: "User and bank account created successfully", accountNumber }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error registering user" }, { status: 500 });
    }
}
