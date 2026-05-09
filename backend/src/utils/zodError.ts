import { ZodError } from "zod";

export const formatZodError = (error: ZodError): string => {
  const messages = error.issues.map((issue) => {
    const path = issue.path.join(".");
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  
  return messages.length > 0 ? messages.join("; ") : "Invalid request payload";
};
