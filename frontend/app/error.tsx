'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Terjadi Kesalahan</h2>
      <p className="mt-4 text-gray-600">
        Maaf, terjadi kesalahan saat memuat halaman.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Coba Lagi
      </button>
    </div>
  );
} 