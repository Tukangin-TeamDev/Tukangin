import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Adapter untuk mengkonversi controller method ke Express RequestHandler
 * Ini mengatasi masalah ketidakcocokan tipe antara interface kustom dan Express Request
 */
export function controllerAdapter(
  handler: (req: any, res: Response) => Promise<any>
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}
