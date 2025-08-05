import React, {useState, useRef, useEffect} from 'react';
import {useLocation} from "react-router-dom";

// Константы
const DEFAULT_MAX_FILES = 1;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const UPLOAD_AREA_STYLES = {
    marginBottom: '20px',
    color: '#2c3e50'
};

const FLEX_CENTER_COLUMN = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

function Preview({imgCallback, uplCallback, isLoading, maxFiles = DEFAULT_MAX_FILES}) {
    const [dragActive, setDragActive] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const inputRef = useRef(null);
    const location = useLocation();

    // Валидация файлов
    const validateFiles = (files) => {
        if (!files?.length) return {isValid: false, message: 'No files selected'};

        const validFiles = Array.from(files).filter(file =>
            SUPPORTED_IMAGE_TYPES.includes(file.type)
        );

        if (validFiles.length === 0) {
            return {isValid: false, message: 'Please select valid image files (JPG, PNG, JPEG)'};
        }

        // Для случая когда достигнут лимит, разрешаем замену
        if (previewImages.length >= maxFiles) {
            return {isValid: true, files: validFiles.slice(0, maxFiles)};
        }

        // Проверяем, не превысим ли лимит при добавлении новых файлов
        const totalFiles = previewImages.length + validFiles.length;
        if (totalFiles > maxFiles) {
            // Берем только столько файлов, сколько можем добавить
            const canAdd = maxFiles - previewImages.length;
            return {isValid: true, files: validFiles.slice(0, canAdd)};
        }

        return {isValid: true, files: validFiles};
    };

    // Обработка файлов и преобразование в base64
    const processFiles = async (files) => {
        const readers = files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
                reader.readAsDataURL(file);
            });
        });

        try {
            return await Promise.all(readers);
        } catch (error) {
            console.error('Error processing files:', error);
            throw error;
        }
    };

    // Обновление превью изображений
    const updatePreviewImages = async (files) => {
        try {
            const results = await processFiles(files);

            let newImages;
            if (previewImages.length >= maxFiles) {
                // Если достигнут лимит, заменяем изображения
                newImages = results;
            } else {
                // Иначе добавляем к существующим
                newImages = [...previewImages, ...results];
            }

            setPreviewImages(newImages);
            imgCallback(newImages);
        } catch (error) {
            console.error('Failed to process images:', error);
            // Здесь можно добавить показ ошибки пользователю
        }
    };

    // Обработчик изменения файлов через input
    const handleImageChange = async (e) => {
        const validation = validateFiles(e.target.files);
        if (!validation.isValid) {
            console.warn(validation.message);
            // Здесь можно показать уведомление пользователю
            return;
        }

        await updatePreviewImages(validation.files);
        // Очистка input для возможности повторного выбора тех же файлов
        e.target.value = '';
    };

    // Обработчики drag & drop
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const validation = validateFiles(e.dataTransfer.files);
        if (!validation.isValid) {
            console.warn(validation.message);
            return;
        }

        await updatePreviewImages(validation.files);
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    useEffect(() => {
            setPreviewImages([]);
            imgCallback([]);
    }, [location.pathname]); // Сброс при смене страницы

    // Вычисляемые значения
    const hasImages = previewImages.length > 0;
    const canAddMore = previewImages.length < maxFiles;
    const remainingSlots = maxFiles - previewImages.length;

    // Генерация текста для состояний
    const getUploadText = () => {
        if (hasImages) {
            return canAddMore
                ? `${previewImages.length} of ${maxFiles} images uploaded. Click to add ${remainingSlots} more.`
                : `Maximum ${maxFiles} images uploaded. Click to change.`;
        }
        return 'Drag and drop images here or click to select';
    };

    const getSupportedFormatsText = () => {
        const maxText = canAddMore ? ` (max ${remainingSlots} more)` : '';
        return `Supported formats: JPG, PNG${maxText}`;
    };

    return (
        <div>
            <h2 style={UPLOAD_AREA_STYLES}>
                Upload Images ({previewImages.length}/{maxFiles})
            </h2>

            <div
                className={`preview-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple={maxFiles > 1}
                    onChange={handleImageChange}
                    style={{display: 'none'}}
                />

                {hasImages ? (
                    <div style={{...FLEX_CENTER_COLUMN, width: '100%'}}>
                        {previewImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Preview ${index + 1}`}
                                className="preview-image"
                            />
                        ))}
                        <p style={{marginTop: '15px', color: '#6c757d'}}>
                            {getUploadText()}
                        </p>
                    </div>
                ) : (
                    <div style={FLEX_CENTER_COLUMN}>
                        <div style={{fontSize: '48px', marginBottom: '15px', color: '#dee2e6'}}>
                            📁
                        </div>
                        <p style={{color: '#6c757d'}}>
                            {getUploadText()}
                        </p>
                        <p style={{color: '#adb5bd', marginTop: '5px'}}>
                            {getSupportedFormatsText()}
                        </p>
                    </div>
                )}
            </div>

            {hasImages && (
                <button
                    className="process-button"
                    onClick={uplCallback}
                    disabled={isLoading}
                    style={{width: '100%'}}
                >
                    {isLoading ? (
                        <div style={{...FLEX_CENTER_COLUMN, flexDirection: 'row', gap: '10px'}}>
                            <span className="loading-spinner"></span>
                            Processing...
                        </div>
                    ) : (
                        `Process ${previewImages.length} Image${previewImages.length > 1 ? 's' : ''}`
                    )}
                </button>
            )}
        </div>
    );
}

export default Preview;