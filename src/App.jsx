import React, {useState} from 'react';
import JSZip from "jszip";
import ImagesList from "./ImageList.jsx";
import './App.css';
import Preview from "./Preview.jsx";
import SideBar from "./SideBar.jsx";
import SaveBar from "./SaveBar.jsx";

function App() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [imagesBase64, setImagesBase64] = useState(null);

    // Обработчик изменения файла в input
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0]; // Вытаскиваем выбранный файл из DOM эл-та <input>...</input>
    //     if (!file) return;
    //
    //     // Создаем превью для отображения
    //     // Обработчик окончания чтения
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         // После окончания чтения файл будет лежать в image в формате base64
    //         setImage(reader.result);
    //     };
    //     reader.readAsDataURL(file);
    // };
    //
    // // Отправка изображения на сервер
    const handleSubmit = async () => {
        if (!image) return;
        setError(null);

        try {
            // Отправляем на сервер FastAPI
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
            // console.log("Получено с сервера0:", imagesBase64);
            // console.log("Получено с сервера1:", coordinatesJson);
            setImagesBase64(imagesBase64);
            //здесь result это уже json строка
            setJsonData(coordinatesJson);
        } catch (err) {
            setError(err.message);
            console.error(err);

        } finally {
            setLoading(false);

        }
    };

    // Функционал кнопки загрузки архива
    const handleDownloadZip = async () => {
        const zip = new JSZip();

        // Добавляем JSON
        zip.file("data.json", JSON.stringify(jsonData, null, 2));

        imagesBase64.forEach((base64Str, i) => {
            const ext = "jpg"; // дефолтное расширение
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


    // const createDownloadLink = (data) => {
    //     if (!data) return;
    //     const jsonString = JSON.stringify(data, null, 2);
    //     const blob = new Blob([jsonString], {type: 'application/json'});
    //     const url = URL.createObjectURL(blob);
    //     setDownloadUrl(url);
    //
    //     return () => URL.revokeObjectURL(url);
    // };
    //
    // React.useEffect(() => {
    //     if (downloadUrl) {
    //         return () => {
    //             URL.revokeObjectURL(downloadUrl);
    //         };
    //     }
    //
    // }, [downloadUrl]);

    const handleDownloadJson = () => {
        const jsonString = JSON.stringify(jsonData, null, 2); // Преобразуем объект в JSON
        const blob = new Blob([jsonString], {type: "application/json"}); // Создаем Blob
        const url = URL.createObjectURL(blob); // Генерируем временную ссылку

        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json"; // Имя скачиваемого файла
        a.click();

        URL.revokeObjectURL(url); // Освобождаем память
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 flex-shrink-0 bg-white h-screen fixed top-0 left-0">
                <SideBar/>
            </aside>

            <div className="flex-grow ml-64 flex justify-center items-stretch px-6 py-8">
                <div className="flex items-stretch max-w-6xl w-full gap-x-6 min-h-[500px]">
                    <div
                        className="flex-grow bg-white rounded-lg shadow-md py-6 px-4 flex flex-col justify-center h-full">
                        <Preview imgCallback={setImage} uplCallback={handleSubmit}/>
                    </div>

                    <div className="w-80 bg-white rounded-lg shadow-md py-6 px-4 ml-4 self-stretch h-full">
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