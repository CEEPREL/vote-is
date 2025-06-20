export interface TokenPayload {
  id: string;
}

export interface UserPayload {
  id: string;
  username?: string;
}

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}
