import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

function mapPrismaError(error) {
  if (!error || typeof error !== "object") {
    return null;
  }

  if (!("code" in error)) {
    return null;
  }

  if (error.code === "P2002") {
    return {
      statusCode: 409,
      message: "Ya existe un registro con esos datos unicos",
    };
  }

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      message: "El recurso solicitado no existe",
    };
  }

  return null;
}

export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const prismaError = mapPrismaError(error);
  const statusCode =
    error instanceof HttpError
      ? error.statusCode
      : prismaError?.statusCode
        ? prismaError.statusCode
        : 500;

  const message =
    error instanceof HttpError
      ? error.message
      : prismaError?.message
        ? prismaError.message
        : "Error interno del servidor";

  const details = error instanceof HttpError ? error.details : undefined;

  const payload = {
    ok: false,
    message,
    ...(details ? { details } : {}),
  };

  if (env.NODE_ENV !== "production") {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
}
