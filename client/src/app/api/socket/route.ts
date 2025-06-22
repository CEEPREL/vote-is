import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/utils/types';

const ioHandler = (_req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('[socket.io] Initializing new Socket.io server...');

    const io = new Server(res.socket.server, {
      path: '/',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('🔌 New socket connected:', socket.id);

      // Handle events
      socket.on('joinRoom', ({ roomId, userName }) => {
        socket.join(roomId);
        io.to(roomId).emit('userJoined', `${userName} joined the room`);
      });

      socket.on('castVote', ({ roomId, optionId, userName }) => {
        io.to(roomId).emit('voteUpdate', { optionId, userName });
      });

      socket.on('sendMessage', ({ roomId, message, userName }) => {
        io.to(roomId).emit('newMessage', {
          message,
          userName,
          timestamp: Date.now(),
        });
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
      });
    });
  } else {
    console.log('[socket.io] Server already running.');
  }

  res.socket.end();
};

export default ioHandler;
