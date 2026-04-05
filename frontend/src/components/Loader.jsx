const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-transparent border-t-violet-600 border-r-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm text-violet-600">Loading...</p>
    </div>
  );
};
export default Loader;