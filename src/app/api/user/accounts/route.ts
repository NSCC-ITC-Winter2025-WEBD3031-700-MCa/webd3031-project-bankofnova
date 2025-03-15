// src/pages/api/user/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserAccountsByUserId } from '@/lib/db';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Invalid or missing userId' }, { status: 400 });
  }

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const userAccounts = await getUserAccountsByUserId(userId);

    if (!userAccounts) {
      return NextResponse.json({ message: 'No accounts found for this user' }, { status: 404 });
    }

    return NextResponse.json(userAccounts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}