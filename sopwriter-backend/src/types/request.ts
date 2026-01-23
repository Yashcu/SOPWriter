import { Request } from 'express';
import { Query } from 'express-serve-static-core';

export interface TypedRequest<TBody = any, TQuery extends Query = Query> extends Request {
  validatedBody: TBody;
  query: TQuery;
}

export interface AuthenticatedRequest extends Request {
  admin: {
    sub: string;
    id: string; // alias for sub
    email: string;
    scope: string;
  };
}
