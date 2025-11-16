export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-24">
      <h1 className="text-4xl font-bold mb-4 text-purple-400 drop-shadow-lg">
        Events Coming Soon
      </h1>

      <p className="text-gray-300 text-lg max-w-2xl text-center mb-10">
        We're curating spectacular events, shows, and experiences just for you. Stay tuned
        for exciting announcements and exclusive releases!
      </p>

      <div className="relative">
        <div className="animate-pulse w-72 h-72 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl opacity-20 blur-2xl absolute -inset-6"></div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-3xl p-10 relative backdrop-blur-xl shadow-xl">
          <img
            src="/events.png"
            alt="Events Icon"
            className="h-28 w-28 mx-auto mb-6 opacity-90"
          />

          <h2 className="text-2xl font-semibold text-center text-white">
            Exciting Experiences Await
          </h2>

          <p className="text-gray-400 text-center mt-2">
            Movies • Shows • Performances • Festivals
          </p>
        </div>
      </div>

      <p className="mt-10 text-gray-500 text-sm">Stay tuned for updates…</p>
    </div>
  );
}