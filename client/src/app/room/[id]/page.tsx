'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/auth';

type VoteOption = { id: string; text: string; voteCount: number };
type Message = { userName: string; message: string; timestamp: number };

export default function RoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  const { user, token } = useAuth();

  const [options, setOptions] = useState<VoteOption[]>([]);
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      userName: 'InsideVote',
      message:
        "🎉 Welcome! We're thrilled to have you here. This is your space to share ideas, make decisions together, and shape the future — one vote at a time! 🚀 Let's make every voice count!",
      timestamp: Date.now(),
    },
  ]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!token || !roomId) return;

    const fetchRoomDataAndSetupSocket = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vote/${roomId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        );

        if (!res.ok) throw new Error('Failed to fetch room data');

        const data = await res.json();

        setOptions(data.votes.options || []);
        setTitle(data.votes.title || 'Untitled');
        setMessages((prev) => [...prev, ...(data.messages || [])]);
        setRoomName(data.roomName || roomId);

        // Initialize socket after successful fetch
        const socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
          withCredentials: true,
          transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          socket.emit('joinRoom', { roomId });
        });

        socket.on('voteUpdate', ({ updatedOptions }) => {
          setOptions(updatedOptions.options);
          setMessages((prev) => [
            ...prev,
            {
              userName: 'System',
              message: `Someone voted`,
              timestamp: Date.now(),
            },
          ]);
        });

        // socket.on('newMessage', (msg: Message) => {
        //   setMessages((prev) => [...prev, msg]);
        // });

        socket.on('userJoined', (msg: string) => {
          setMessages((prev) => [
            ...prev,
            { userName: 'System', message: msg, timestamp: Date.now() },
          ]);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connect error:', err.message);
        });
      } catch (error) {
        console.error('Fetch or connection error:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDataAndSetupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, token, router]);

  const castVote = (optionId: string) => {
    if (!socketRef.current || !user || !roomId) return;
    socketRef.current.emit('castVote', {
      roomId,
      optionId,
      userName: 'Anonymous User',
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !socketRef.current || !roomId || !user) return;
    socketRef.current.emit('sendMessage', {
      roomId,
      message: chatInput.trim(),
      userName: user.name,
    });
    setChatInput('');
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen w-screen bg-black text-green-400">
        <p className="text-lg animate-pulse">Loading room data...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-black text-green-400 font-mono px-4 py-6">
      <header className="mb-4 border-b border-green-700 pb-2 text-center sm:text-left">
        <div className="flex gap-5">
          <button onClick={() => router.push('/dashboard')}>Back</button>
        </div>
        <h1 className="text-2xl font-bold tracking-wider">
          Room ID: {roomName}
        </h1>
        <p className="text-sm text-green-600">
          Logged in as: <span className="text-green-300">{user?.name}</span>
        </p>
      </header>

      <section className="flex flex-col max-h-[95vh] sm:flex-row flex-1 gap-4 sm:gap-6">
        {/* Voting Panel */}
        <div className="sm:w-1/3 w-full bg-zinc-900 border border-green-700 rounded p-4 shadow-lg">
          <h2 className="text-xl mb-4 text-green-300">🗳️ {title}</h2>
          <ul className="space-y-3">
            {options.map((opt) => (
              <li
                key={opt.id}
                className="p-3 border border-green-800 rounded cursor-pointer hover:bg-green-950 transition-all text-lg"
                onClick={() => castVote(opt.id)}
              >
                <div className="flex justify-between">
                  <span>{opt.text}</span>
                  <span className="font-bold">{opt.voteCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col max-h-[95vh] bg-zinc-900 border border-green-700 rounded p-4 shadow-lg">
          <h2 className="text-xl mb-2 text-green-300">💬 Live Chat</h2>
          <div className="flex-1 overflow-y-auto border border-green-800 rounded p-2 bg-black mb-3 max-h-80 sm:max-h-full">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.userName === user?.name ? 'text-right' : 'text-left'
                } ${
                  msg.userName === 'InsideVote' ? 'italic text-green-500' : ''
                }`}
              >
                <span className="font-bold">{msg.userName}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-green-600 text-green-200 rounded placeholder-green-500"
              placeholder="This feature will soon be available"
              disabled
            />
            <button
              onClick={sendMessage}
              className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-black font-bold cursor-not-allowed opacity-50"
              disabled
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
