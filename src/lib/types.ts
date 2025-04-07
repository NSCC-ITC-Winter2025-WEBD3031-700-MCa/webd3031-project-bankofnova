import { Session } from "next-auth";

// Custom session type with optional email and account_number
export interface CustomSession extends Omit<Session, "user"> {
  user: {
    id: string;
    email: string | null;
    role: string;
    name?: string | null; // Name is now optional
    image?: string | null; // Optional image field
  };
  expires: string;
}
// types.ts
export interface Employer {
  id: number;
  name: string;
  account_number: string;
  balance: number;
  role: 'user' | 'admin' | 'employer';
  amount?: number;
}
