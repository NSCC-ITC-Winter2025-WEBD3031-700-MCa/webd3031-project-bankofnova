import NextAuth from "next-auth";
import { authOptions } from "../../../../auth";

// Export the NextAuth handler for GET and POST methods
export const handler = NextAuth(authOptions);

// Export the HTTP methods
export const GET = handler;
export const POST = handler;
