import pool from "./db"; // Ensure this imports your MariaDB connection
export const processDeposit = async (userId: string, accountId: string, amount: number, sender_account_id: string): Promise<boolean> => {
  try {
    // Round the deposit amount to 2 decimal places before adding it to the balance
    const roundedAmount = Math.round(amount * 100) / 100;

    // Start a transaction to ensure both operations are atomic
    await pool.query('START TRANSACTION');

    // Update the balance of the chequing account by adding the deposit amount
    const [balanceResult] = await pool.query(
      'UPDATE bank_accounts SET balance = balance + ? WHERE id = ? AND user_id = ?',
      [roundedAmount, accountId, userId]
    );

    // If the balance update was successful, create the deposit transaction record
    if ((balanceResult as { affectedRows: number }).affectedRows > 0) {
      // Get the userId of the account holder for the receiver_account_id
      const [userResult] = await pool.query(
        'SELECT user_id FROM bank_accounts WHERE id = ?',
        [accountId]
      );

      if ((userResult as any).length > 0) {
        const receiverId = (userResult as any)[0].user_id;

        // Insert the transaction with the sender_account_id
        const [transactionResult] = await pool.query(
          `INSERT INTO transactions (sender_account_id, receiver_account_id, sender_id, receiver_id, transaction_type, amount, status) 
          VALUES (?, ?, ?, ?, 'deposit', ?, 'completed')`,
          [sender_account_id, accountId, userId, receiverId, roundedAmount]
        );

        // If the transaction was successfully inserted, commit the changes
        if ((transactionResult as { affectedRows: number }).affectedRows > 0) {
          await pool.query('COMMIT');
          return true;
        } else {
          // If transaction insertion failed, rollback the changes
          await pool.query('ROLLBACK');
          return false;
        }
      } else {
        // If no user found for the account, rollback the changes
        await pool.query('ROLLBACK');
        return false;
      }
    } else {
      // If the balance update failed, rollback the changes
      await pool.query('ROLLBACK');
      return false;
    }
  } catch (err) {
    console.error("Error processing deposit:", err);
    // Rollback any changes if an error occurs
    await pool.query('ROLLBACK');
    return false;
  }
};
