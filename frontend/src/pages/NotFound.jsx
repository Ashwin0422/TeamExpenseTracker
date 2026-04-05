export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-gray-800 select-none">404</p>
      <h1 className="text-2xl font-semibold text-gray-100 mt-2">Page not found</h1>
      <p className="text-gray-500 mt-2 text-sm max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 px-5 py-2.5 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-200 transition-colors"
      >
        Go back home
      </a>
    </div>
  );
}