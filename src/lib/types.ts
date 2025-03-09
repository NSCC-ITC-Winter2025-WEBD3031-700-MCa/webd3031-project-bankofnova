import { Session } from "next-auth";

// Custom session type with optional email and account_number
export interface CustomSession extends Omit<Session, "user"> {
  user: {
    id: string;
    email: string | null;
    role: string;
  };
  expires: string;
}
