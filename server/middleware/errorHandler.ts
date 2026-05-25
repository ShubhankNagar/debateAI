/**
 * Centralized error handling middleware.
 */
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(`[Error] ${err.message}`);

  const statusCode = (err as any).statusCode || 500;
  const message = process.env.NODE_ENV === "production"
    ? "An internal error occurred. Please try again."
    : err.message;

  res.status(statusCode).json({
    error: message,
    success: false,
  });
}
