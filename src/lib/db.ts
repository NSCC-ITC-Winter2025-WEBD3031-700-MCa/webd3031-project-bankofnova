// src/lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'nextjs_user',
  password: 'strongpassword',
  database: 'bankofnova',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Define the User interface with optional bank account fields
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  password: string;
}

// Updated function to get a user by email including bank account data
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [rows] = await pool.execute<mysql.RowDataPacket[]>(`
      SELECT users.*, bank_accounts.account_number, bank_accounts.id AS bank_accounts_id
      FROM users
      LEFT JOIN bank_accounts ON users.id = bank_accounts.user_id
      WHERE users.email = ?`, [email]);

    if (rows.length > 0) {
      const user = {
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        role: rows[0].role,
        password: rows[0].password,
        bankAccounts: rows.map(row => ({
          account_number: row.account_number,
          bank_accounts_id: row.bank_accounts_id
        }))
      };
      
      return user;
    }

    return null; // If no user found
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
