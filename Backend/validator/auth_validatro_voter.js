import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(300, { message: "Name must not exceed 300 characters" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces" }),

  age: z.coerce
    .number({ required_error: "Age is required" })
    .min(18, { message: "Age must be at least 18" })
    .max(60, { message: "Age must not be more than 60" }),

  stream: z.enum(["CSE","ECE","IT","ME","EE","CE"], {
    required_error: "Role is required",
  }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email format" }),

  role: z.enum(["voter", "candidate"], {
    required_error: "Role is required",
  }),

  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(3, { message: "Address must be at least 3 characters" })
    .max(300, { message: "Address must not exceed 300 characters" }),

  pincode: z.coerce
    .string({ required_error: "Pincode is required" })
    .trim()
    .regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(128, { message: "Password must not exceed 128 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

export default signupSchema;
