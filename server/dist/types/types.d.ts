export interface TokenPayload {
    id: string;
    username?: string;
    email: string;
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
