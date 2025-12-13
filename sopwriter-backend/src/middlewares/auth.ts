import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminTokenPayload {
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, code: 'AUTH_REQUIRED', message: 'Missing Authorization header' });
  }
  const token = auth.slice('Bearer '.length).trim();
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as AdminTokenPayload;
    if (!payload || (payload.role && payload.role !== 'admin')) {
      return res
        .status(403)
        .json({ success: false, code: 'FORBIDDEN', message: 'Insufficient permissions' });
    }
    // attach admin info
    (req as any).admin = payload;
    next();
    return;
  } catch (_err) {
    return res.status(401).json({ success: false, code: 'AUTH_INVALID', message: 'Invalid token' });
  }
}
