import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth"; // Ensure correct path
import { processTransfer } from "../../../../lib/transactions"; // Import the function

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
  }

  try {
    const { sender_account_id, receiver_account_id, amount } = await req.json();

    // Ensure all fields are present and valid
    if (!sender_account_id || !receiver_account_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Explicitly convert to number
    const senderAccountId = parseInt(sender_account_id as string, 10);
    const receiverAccountId = parseInt(receiver_account_id as string, 10);
    const transferAmount = parseFloat(amount as string);

    // Ensure the converted values are valid numbers
    if (isNaN(senderAccountId) || isNaN(receiverAccountId) || isNaN(transferAmount)) {
      return NextResponse.json({ error: "Invalid number format" }, { status: 400 });
    }

    // Explicitly convert sender_user_id to a number
    const sender_user_id = parseInt(session.user.id as string, 10); // Ensure sender_user_id is a number

    if (isNaN(sender_user_id)) {
      return NextResponse.json({ error: "Invalid sender user ID" }, { status: 400 });
    }

    // Call processTransfer with sender_account_id, receiver_account_id, amount, and user_id
    const result = await processTransfer(senderAccountId, receiverAccountId, transferAmount, sender_user_id);

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
};
