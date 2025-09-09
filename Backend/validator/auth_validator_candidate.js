import { z } from "zod";

const candidateSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must not exceed 100 characters" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces" }),

  age: z.coerce
    .number({ required_error: "Age is required" })
    .min(25, { message: "Age must be at least 25" })
    .max(70, { message: "Age must not be more than 70" }),

stream: z.enum(["CSE","ECE","IT","ME","EE","CE"], {
    required_error: "Role is required",
  }),
email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email format" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(128, { message: "Password must not exceed 128 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),

  role: z.enum(["voter", "candidate"], {
    required_error: "Role is required",
  }),
});

export default candidateSchema;
