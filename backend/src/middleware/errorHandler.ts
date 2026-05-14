import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    errors: [],
  });
};

export default errorHandler;
