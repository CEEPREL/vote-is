import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-black to-black px-4">
      <div className="bg-black backdrop-blur-md shadow-xl shadow-gray-500 rounded-2xl w-full max-w-md p-8 text-center ">
        <h1 className="text-4xl font-extrabold mb-2 text-green-700 tracking-tight">
          !N-VoteRoom
        </h1>
        <p className="text-white mb-6 text-sm">
          Make <span className="text-green-600 font-semibold">decisions</span>{' '}
          fast. <br />
          Together.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/create-room"
            className="bg-green-600 text-white py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
          >
            Create Room
          </Link>
          <Link
            href="/login"
            className="bg-black border-green-600 border text-white py-2 rounded-full font-semibold hover:bg-gray-900 transition"
          >
            Login / Register
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400 italic">
          Invite. Vote. Done.
        </div>
      </div>
    </main>
  );
}
