import NextAuth from "next-auth";
import { authOptions } from "../../../../auth";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST HTTP methods, explicitly typing them
export const GET = handler as (req: Request, res: Response) => void;
export const POST = handler as (req: Request, res: Response) => void;
