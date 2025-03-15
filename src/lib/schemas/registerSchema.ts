import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be less than 50 characters"),
    
    email: z.string().email("Invalid email format"),
    
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine((val) => /[A-Z]/.test(val), { message: "At least one uppercase letter required" })
      .refine((val) => /[a-z]/.test(val), { message: "At least one lowercase letter required" })
      .refine((val) => /[0-9]/.test(val), { message: "At least one number required" })
      .refine((val) => /[\W_]/.test(val), { message: "At least one special character required" }),
  });
  