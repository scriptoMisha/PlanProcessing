import React, {useState, useRef} from 'react';

function Preview({imgCallback, uplCallback, isLoading}) {
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        console.log('handleImageChange triggered');
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = reader.result;
            console.log('Image loaded:', img);
            imgCallback(img);
            setPreviewImage(img);
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = reader.result;
                imgCallback(img);
                setPreviewImage(img);
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>
                Upload Image
            </h2>

            <div
                className={`preview-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />

                {previewImage ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="preview-image"
                        />
                        <p style={{ marginTop: '15px', color: '#6c757d' }}>
                            Image uploaded successfully. Click to change.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px', color: '#dee2e6' }}>
                            📁
                        </div>
                        <p style={{ color: '#6c757d' }}>
                            Drag and drop an image here or click to select
                        </p>
                        <p style={{ color: '#adb5bd', marginTop: '5px' }}>
                            Supported formats: JPG, PNG
                        </p>
                    </div>
                )}
            </div>

            {previewImage && (
                <button
                    className="process-button"
                    onClick={uplCallback}
                    disabled={isLoading}
                    style={{ width: '100%' }}
                >
                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <span className="loading-spinner"></span>
                            Processing...
                        </div>
                    ) : (
                        'Process Image'
                    )}
                </button>
            )}
        </div>
    );
}

export default Preview;
