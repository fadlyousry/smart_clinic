const AppointmentTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex border-b pb-2 border-gray-200 w-full md:w-auto">
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                    }`}
                onClick={() => setActiveTab('past')}
            >
                السابقة
            </button>
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'today' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                    }`}
                onClick={() => setActiveTab('today')}
            >
                اليوم
            </button>
            <button
                className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'text-white bg-cyan-500 rounded-2xl' : 'text-gray-500'
                    }`}
                onClick={() => setActiveTab('upcoming')}
            >
                القادمة
            </button>
        </div>
    );
};

export default AppointmentTabs;