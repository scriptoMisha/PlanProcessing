import React from 'react';

function ImagesList({ imagesBase64, onImageClick }) {
  if (!imagesBase64 || imagesBase64.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Picture:</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imagesBase64.map((base64, index) => (
          <div
            key={index}
            className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
            onClick={() => onImageClick(base64)}
          >
            <img
              src={`data:image/png;base64,${base64}`}
              alt={`image-${index}`}
              className="w-full h-auto rounded-md object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImagesList;
