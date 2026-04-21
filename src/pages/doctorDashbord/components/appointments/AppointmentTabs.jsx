const AppointmentTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { key: 'queue', label: '⏳ الدور', color: 'bg-amber-500' },
        { key: 'inExam', label: '🩺 في الكشف', color: 'bg-purple-500' },
        { key: 'done', label: '✅ تم اليوم', color: 'bg-emerald-500' },
        { key: 'upcoming', label: 'القادمة', color: 'bg-cyan-500' },
        { key: 'past', label: 'السابقة', color: 'bg-gray-500' },
    ];

    return (
        <div className="flex flex-wrap border-b pb-2 border-gray-200 w-full md:w-auto gap-1">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    className={`px-4 py-2 font-medium text-sm rounded-2xl transition-all ${
                        activeTab === tab.key 
                            ? `text-white ${tab.color} shadow-sm` 
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default AppointmentTabs;