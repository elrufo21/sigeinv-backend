import { notFound } from "../lib/http-error.js";

export function notFoundMiddleware(req, res, next) {
  next(notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}
