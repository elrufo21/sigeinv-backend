import { ZodError } from "zod";
import { badRequest } from "./http-error.js";

function toValidationDetails(error) {
  if (!(error instanceof ZodError)) {
    return undefined;
  }

  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function parseSchema(schema, value, message = "Datos de entrada invalidos") {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw badRequest(message, toValidationDetails(result.error));
  }

  return result.data;
}
