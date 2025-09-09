import { ZodError } from "zod";

const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      console.log("Zod validation error:", err.issues); // <-- use .issues
      const firstError = err.issues?.[0]?.message || "Validation failed";
      return res.status(400).json({ message: firstError });
    }

    console.error("Unexpected error in validate middleware:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default validate;
