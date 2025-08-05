import React, { useState, useEffect } from 'react';
import ImagesList from "./ImageList.jsx";

function SaveBar({ jsonData, handleDownloadJson, handleDownloadZip, imagesBase64,pageNumber=1}) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageClick = (base64) => {
    setPreviewImage(base64);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  // Esc key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && previewImage) {
        closePreview();
      }
    };

    // Handler active only when preview is opened
    if (previewImage) {
      document.addEventListener('keydown', handleEscKey);
    }

    // clean up handler when
    // Clearing the handler when unmounting the component or closing the preview
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [previewImage]);


  const hasData = jsonData;

  return (
    <div className="savebar-content">
      <h2 style={{ marginBottom: '15px', color: '#2c3e50' }}>
        Processing Results
      </h2>

      {hasData ? (
        <div>
          <p style={{ marginBottom: '20px', color: '#6c757d' }}>
            Processing completed! You can download the results:
          </p>

          <div className="download-buttons">
            <button
              onClick={handleDownloadJson}
              className="download-button json"
            >
              📄 Download JSON
            </button>

            {pageNumber ===1 ? (<button
              onClick={handleDownloadZip}
              className="download-button"
            >
              📦 Download ZIP Archive
            </button>): null}
          </div>

          <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e9ecef' }}>
            <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>
              <strong>JSON:</strong> below is the Json content<br />
              {pageNumber===1?(
                  <>
              <strong>ZIP:</strong> includes all images and JSON file
              </>): null}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.3 }}>
            📥
          </div>
          <p style={{ color: '#adb5bd', margin: 0 }}>
            Upload and process an image to get results
          </p>
        </div>
      )}

      {jsonData && (
        <div className="json-result-container">
          <h3 className="json-result-title">📋 Result:</h3>
          <pre className="json-result-content">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      )}

        {pageNumber===1?(
      <ImagesList imagesBase64={imagesBase64} onImageClick={handleImageClick} />): null}

      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePreview();
            }
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
            <img
              src={`data:image/png;base64,${previewImage}`}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                fontSize: '16px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close (Esc)"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SaveBar;
