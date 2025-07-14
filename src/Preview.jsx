import React, {useState, useRef} from 'react';

function Preview({imgCallback, uplCallback}) {
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const inputRef = useRef(null); // 🔹 Используем ссылку вместо querySelector

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
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setPreviewImage(result);
                imgCallback(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Обработка изображений</h1>

            <div
                className={`upload-section ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } relative`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                />

                <div
                    className="w-full h-64 md:h-96 flex items-center justify-center border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:border-blue-400 hover:cursor-pointer"
                    onClick={handleButtonClick}
                >
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                        />
                    ) : (
                        <div className="text-center">
                            <svg
                                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <p className="text-gray-500">Перетащите изображение сюда или кликните для выбора</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 🔹 Кнопка Upload */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={uplCallback}
                    className="px-6 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-300"
                >
                    Загрузить изображение
                </button>
            </div>
        </div>
    );
}

export default Preview;
