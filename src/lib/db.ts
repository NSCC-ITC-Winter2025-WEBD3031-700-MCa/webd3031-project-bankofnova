// src/lib/db.ts
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'nextjs_user',
  password: 'strongpassword',
  database: 'bankofnova',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Define the User interface with donly essential fields
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  password: string; // Add the password field here for authentication
}

// GET user accounts by userId
export async function getUserAccountsByUserId(userId: string): Promise<Array<{ id: string; account_number: string; account_type: string; balance: number }>> {
  try {
    const query = `
      SELECT id, account_number, account_type, balance
      FROM bank_accounts
      WHERE user_id = ?;
    `;
    const [rows] = await pool.execute(query, [userId]); // Using the connection pool to execute the query

    return rows as Array<{ id: string; account_number: string; account_type: string; balance: number }>;
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    throw new Error("Failed to fetch user accounts.");
  }
}

// GET user accounts by emailS
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(`
      SELECT id, email, name, role, password, github_id, google_id
      FROM users
      WHERE email = ?`, [email]);

    if (rows.length > 0) {
      const user = {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        role: rows[0].role,
        password: rows[0].password, // Include password for authentication
        github_id: rows[0].github_id,
        google_id: rows[0].google_id,
      };
      return user;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Error fetching user by email');
  }
};

// GET ALL employer details from the database
export const getEmployerDetails = async (userId: number) => {
  const query = `
    SELECT 
      users.id, 
      users.name, 
      bank_accounts.balance, 
      COALESCE(user_employer.withdrawal_limit, 0) AS withdrawal_limit -- Default to 0 if NULL
    FROM users
    JOIN bank_accounts ON users.id = bank_accounts.user_id
    LEFT JOIN user_employer ON users.id = user_employer.employer_id 
      AND user_employer.user_id = ?  
    WHERE users.role = "employer" 
  `;

  try {
    const [rows] = await pool.execute(query, [userId]) as [RowDataPacket[], any];
    return rows;
  } catch (err) {
    console.error("Error fetching employer details:", err);
    throw new Error("Error fetching employer details");
  }
};

// GET only employer details with withdrawl limits set by user from the database
export const getEmpWithLimit = async (userId: number) => {
  const query = `
    SELECT 
      users.id, 
      users.name, 
      bank_accounts.balance, 
      user_employer.withdrawal_limit
    FROM users
    JOIN bank_accounts ON users.id = bank_accounts.user_id
    LEFT JOIN user_employer ON users.id = user_employer.employer_id
    WHERE users.role = "employer" 
      AND user_employer.user_id = ?  -- Ensure we're filtering by user_id
  `;

  try {
    const [rows] = await pool.execute(query, [userId]) as [RowDataPacket[], any];
    return rows;
  } catch (err) {
    console.error("Error fetching employer details:", err);
    throw new Error("Error fetching employer details");
  }
};

// Function to get a user by account number 
export const getUserByAccountNumber = async (account_number: string): Promise<User | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(`
      SELECT users.*, bank_accounts.account_number, bank_accounts.id AS bank_accounts_id
      FROM users
      LEFT JOIN bank_accounts ON users.id = bank_accounts.user_id
      WHERE bank_accounts.account_number = ?`, [account_number]);

    if (rows.length > 0) {
      return rows[0] as User;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user by account number:', error);
    throw new Error('Error fetching user by account number');
  }
};

//
//for Oauth
// Function to create a new user
// Function to create a new user

export const createUser = async (user: { 
  email: string; 
  name: string; 
  password: string; 
  role?: string; 
  github_id?: string | null;  // Allow null or string for github_id
  google_id?: string | null;  // Allow null or string for google_id
}): Promise<number> => {
  const role = user.role ?? 'user'; // Default role to 'user' if not provided

  try {
    const query = `
      INSERT INTO users (email, name, role, password, github_id, google_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      user.email,
      user.name,
      role,
      user.password,
      user.github_id || null,
      user.google_id || null,
    ]);

    const insertResult = result as mysql.ResultSetHeader;
    console.log("New user created:", insertResult);
    return insertResult.insertId; // Return the new user's ID
  } catch (error) {
    console.error('Error creating new user:', error);
    throw new Error('Error creating new user');
  }
};

//
//for Oauth
// Generate a unique 8-digit account number
export const generateAccountNumber = async (): Promise<string> => {
  let accountNumber = "";
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
//
//for Oauth
// Create default chequing account for a user
export const createDefaultChequingAccount = async (userId: number) => {
  const accountNumber = await generateAccountNumber();
  await pool.query(
    "INSERT INTO bank_accounts (user_id, account_number, account_type) VALUES (?, ?, ?)",
    [userId, accountNumber, "chequing"]
  );
  return accountNumber;
};
//
//for Oauth
export const updateUser = async (userId: string, updatedFields: { google_id?: string | null, github_id?: string | null }) => {
  // Example query to update the user in the database
  await pool.query(
    `UPDATE users SET google_id = ?, github_id = ? WHERE id = ?`,
    [updatedFields.google_id, updatedFields.github_id, userId]
  );
}
//for Oauth
export default pool;

 