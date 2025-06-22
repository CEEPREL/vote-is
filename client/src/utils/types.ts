import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { Server as IOServer } from 'socket.io';

export type User = {
  email: string;
  name?: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  token: string | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export interface Room {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export type NextApiResponseServerIO = {
  socket: Socket & {
    server: HTTPServer & {
      io: IOServer;
    };
  };
};

export type SocketContextType = {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
};
