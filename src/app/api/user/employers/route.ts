import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { getEmployerDetails } from '@/lib/db'; // Import the function

export async function GET(req: NextRequest) {
  // Fetch the session of the logged-in user
  const session = await getServerSession(authOptions);

  if (!session) {
    // If there's no session, return Unauthorized
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Convert user ID to a number if it is a string
    const loggedInUserId = Number(session.user.id);

    if (isNaN(loggedInUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Pass the logged-in user's ID to the getEmployerDetails function
    const employerDetails = await getEmployerDetails(loggedInUserId);

    if (!employerDetails || employerDetails.length === 0) {
      // If no employer details are found, return a 404 error
      return NextResponse.json({ error: 'No employer details found' }, { status: 404 });
    }

    // Return the employer details for the logged-in user
    return NextResponse.json(employerDetails);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
