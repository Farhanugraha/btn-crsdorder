'use client';

import React, { useState } from 'react';
import { ImageIcon, X, ZoomIn } from 'lucide-react';

interface ProofImageProps {
  imageUrl: string;
  apiUrl: string;
}

export const ProofImage: React.FC<ProofImageProps> = ({
  imageUrl,
  apiUrl
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fullImageUrl = `${apiUrl}/storage/${imageUrl}`;

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Gagal memuat gambar
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={fullImageUrl}
          alt="Bukti Pembayaran"
          className="w-full rounded-lg object-cover transition-all group-hover:opacity-90"
          onError={handleImageError}
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Modal for full image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -right-4 -top-4 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={fullImageUrl}
              alt="Bukti Pembayaran"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
