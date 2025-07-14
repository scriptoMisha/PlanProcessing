import ImagesList from "./ImageList.jsx";
import React from "react";

function SaveBar({ jsonData, handleDownloadJson, handleDownloadZip, imagesBase64 }) {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Сохранение результатов</h2>

      {jsonData && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadJson}
            className="px-6 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-300"
          >
            📄 Скачать JSON
          </button>
          <button
            onClick={handleDownloadZip}
            className="px-6 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-300"
          >
            🗜️ Скачать ZIP
          </button>
        </div>
      )}

      {jsonData && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner overflow-auto max-h-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📋 Результат:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}

      <ImagesList imagesBase64={imagesBase64} />
    </div>
  );
}

export default SaveBar;
