import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";  
import { processDeposit } from "../../../../lib/deposits";  
import { getUserAccountsByUserId } from "../../../../lib/db";  

export async function POST(req: NextRequest) {
  try {
    // Get the session using NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Convert session.user.id to a string if needed
    const userId = session.user.id.toString();
    if (!userId) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Get the deposit amount and accountType from the request body
    const { amount, accountType } = await req.json();
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid deposit amount" }, { status: 400 });
    }

    // Validate account type
    if (!['chequing', 'savings'].includes(accountType)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // Fetch user accounts based on the userId
    const accounts = await getUserAccountsByUserId(userId);
    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: "No accounts found for this user" }, { status: 400 });
    }

    // Find the selected account (either 'chequing' or 'savings')
    const account = accounts.find(account => account.account_type === accountType);
    if (!account) {
      return NextResponse.json({ error: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} account not found` }, { status: 400 });
    }

    // Process the deposit and update the balance in the selected account
    const success = await processDeposit(userId, account.id, amount);
    if (success) {
      return NextResponse.json({ message: "Deposit successful!" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to process deposit" }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
