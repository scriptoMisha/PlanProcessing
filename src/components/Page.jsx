import React, {useState, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import Preview from "./Preview.jsx";
import SaveBar from "./SaveBar.jsx";
import JSZip from "jszip";

function Page({pageNumber}) {
    const [images, setImages] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const [imagesBase64, setImagesBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // Очистка состояния при смене страницы
    useEffect(() => {
        setImages([]);
        setJsonData(null);
        setImagesBase64(null);
        setIsLoading(false);
    }, [location.pathname]); // Срабатывает при изменении пути

    const handleSubmit = async () => {
        if (images.length === 0) return;
        setIsLoading(true); // Start loading
        try {
            // Sending data to FastAPI
            const response = await fetch('http://localhost:8000/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({image_base64: images[0]}),
            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.detail);

            }
            const coordinatesJson = JSON.parse(data.metadata)
            const imagesBase64 = data.images;
            setImagesBase64(imagesBase64);
            setJsonData(coordinatesJson);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };
    const handleSubmitForCallout = async () =>{
        if (images.length === 0) return;
        setIsLoading(true); // Start loading
        try {
            // Sending data to FastAPI
            const response = await fetch('http://localhost:8000/callout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({images: images}),
            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.detail);

            }

            setJsonData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Stop loading
        }
    }

    // Button of downloading zip
    const handleDownloadZip = async () => {
        const zip = new JSZip();

        // Добавляем JSON
        zip.file("data.json", JSON.stringify(jsonData, null, 2));

        imagesBase64.forEach((base64Str, i) => {
            const ext = "jpg"; // Default extension
            zip.file(`image_${i + 1}.${ext}`, base64Str, {base64: true});
        });

        const content = await zip.generateAsync({type: "blob"});
        const url = URL.createObjectURL(content);

        const a = document.createElement("a");
        a.href = url;
        a.download = "images.zip";
        a.click();

        URL.revokeObjectURL(url);
    };


    const handleDownloadJson = () => {
        const jsonString = JSON.stringify(jsonData, null, 2); // Convert object to JSON
        const blob = new Blob([jsonString], {type: "application/json"}); // Blob creating
        const url = URL.createObjectURL(blob); // Generating a temporary link

        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json"; // The name of the downloaded file
        a.click();

        URL.revokeObjectURL(url); // Freeing up memory
    };
    return (
        <div className="content-wrapper">
            <div className="preview-container">
                <Preview imgCallback={setImages} uplCallback={pageNumber===1 ? handleSubmit : handleSubmitForCallout} isLoading={isLoading} maxFiles={pageNumber}/>
            </div>

            <div className="savebar-container">
                <SaveBar
                    jsonData={jsonData}
                    handleDownloadJson={handleDownloadJson}
                    handleDownloadZip={handleDownloadZip}
                    imagesBase64={imagesBase64}
                    pageNumber={pageNumber}
                />
            </div>
        </div>);
}

export default Page;