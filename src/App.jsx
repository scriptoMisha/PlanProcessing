import React, {useState} from 'react';
import JSZip from "jszip";
import './App.css';
import Preview from "./components/Preview.jsx";
import SideBar from "./components/SideBar.jsx";
import SaveBar from "./components/SaveBar.jsx";

function App() {
    const [image, setImage] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [imagesBase64, setImagesBase64] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleSubmit = async () => {
        if (!image) return;
        setIsLoading(true); // Start loading
        try {
            // Sending data to FastAPI
            const response = await fetch('https://planprocess-back.onrender.com/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({image_base64: image}),
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
        <div className="app-container">
            <aside className="sidebar">
                <SideBar/>
            </aside>

            <div className="content-container">
                <div className="content-wrapper">
                    <div className="preview-container">
                        <Preview imgCallback={setImage} uplCallback={handleSubmit} isLoading={isLoading} />
                    </div>

                    <div className="savebar-container">
                        <SaveBar
                            jsonData={jsonData}
                            handleDownloadJson={handleDownloadJson}
                            handleDownloadZip={handleDownloadZip}
                            imagesBase64={imagesBase64}
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default App;