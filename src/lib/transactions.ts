import pool from "./db"; // Ensure the path to your DB connection is correct
import { RowDataPacket } from "mysql2/promise";

// Updated processTransfer function to include user_id in the payload
export const processTransfer = async (
  sender_account_id: number,
  receiver_account_id: number,
  amount: number,
  sender_user_id: number // Sender's user_id is passed in
) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Lock sender's balance for consistency
    const [senderResult] = await connection.query<RowDataPacket[]>(
      "SELECT balance FROM bank_accounts WHERE id = ? FOR UPDATE",
      [sender_account_id]
    );

    const sender = senderResult.length > 0 ? senderResult[0] : null;

    if (!sender || sender.balance < amount) {
      throw new Error("Insufficient funds");
    }

    // Check if receiver account exists and get receiver's user ID
    const [receiverResult] = await connection.query<RowDataPacket[]>(
      "SELECT id, user_id FROM bank_accounts WHERE id = ?",
      [receiver_account_id]
    );

    if (receiverResult.length === 0) {
      throw new Error("Receiver account does not exist.");
    }

    const receiver_user_id = receiverResult[0].user_id;

    // Deduct from sender
    await connection.query(
      "UPDATE bank_accounts SET balance = balance - ? WHERE id = ?",
      [amount, sender_account_id]
    );

    // Add to receiver
    await connection.query(
      "UPDATE bank_accounts SET balance = balance + ? WHERE id = ?",
      [amount, receiver_account_id]
    );

    // Insert transaction record with sender_account_id and receiver_account_id
    await connection.query(
      "INSERT INTO transactions (sender_account_id, receiver_account_id, sender_id, receiver_id, transaction_type, amount, status) VALUES (?, ?, ?, ?, 'transfer', ?, 'completed')",
      [sender_account_id, receiver_account_id, sender_user_id, receiver_user_id, amount]
    );

    await connection.commit();
    return { success: true, message: "Transaction successful" };
  } catch (error: any) {
    await connection.rollback();
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
};
