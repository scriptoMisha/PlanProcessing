function Sidebar() {
    return (
        <div className="w-64 bg-white h-screen p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">PlansAI</h2>
            <ul className="space-y-2">
                <li>
                    <button className="px-6 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-300">Главная</button>
                </li>
                <li>
                    <button className="px-6 py-2 bg-yellow-400 text-gray-800 font-semibold rounded-xl shadow hover:bg-yellow-500 transition duration-300">Меню</button>
                </li>

            </ul>
        </div>);
}
export default Sidebar
