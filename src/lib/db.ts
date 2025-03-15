// src/lib/db.ts
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';


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

// Function to get user accounts by userId
export async function getUserAccountsByUserId(userId: string) {
  try {
    const query = `
      SELECT id, account_number, account_type, balance
      FROM bank_accounts
      WHERE user_id = ?;
    `;
    const [rows] = await pool.execute(query, [userId]); // Using the connection pool to execute the query

    return rows;
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    throw new Error("Failed to fetch user accounts.");
  }
}

// Updated function to get a user by email (simplified to return basic info)
// Updated function to get a user by email including password
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(`
      SELECT id, email, name, role, password
      FROM users
      WHERE email = ?`, [email]);

    if (rows.length > 0) {
      const user = {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        role: rows[0].role,
        password: rows[0].password, // Include password for authentication
      };
      return user;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Error fetching user by email');
  }
};


// Function to get a user by account number (already updated)
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


export default pool;
