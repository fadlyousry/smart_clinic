const MedicationsList = ({ 
    activeCategory, 
    onCategoryChange, 
    onMedClick, 
    medicationsData,
    isMedAlreadyAdded 
}) => {
    const medicationsList = medicationsData?.find(cat => cat.name === activeCategory)?.medications || [];

    return (
        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

            <div className="bg-gray-100 p-2 rounded-lg mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                    {medicationsData?.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => onCategoryChange(cat.name)}
                            className={`w-full py-2 rounded-lg text-center font-medium transition ${
                                activeCategory === cat.name
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300'
                            }`}
                            style={{ backgroundColor: activeCategory === cat.name ? "var(--color-accent)" : undefined }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <div className="grid grid-cols-2 gap-3">
                    {medicationsList.length > 0 ? (
                        medicationsList.map((med, idx) => (
                            <button
                                key={idx}
                                onClick={() => onMedClick(med.name)}
                                className={`p-4 border rounded-lg transition text-center flex items-center justify-center h-20 ${
                                    isMedAlreadyAdded(med.name)
                                        ? 'bg-green-100 border-green-300'
                                        : 'border-gray-200 hover:bg-blue-50'
                                }`}
                            >
                                <span className={`font-medium ${
                                    isMedAlreadyAdded(med.name) ? 'text-green-700' : ''
                                }`}>
                                    {med.name}
                                    {isMedAlreadyAdded(med.name) && (
                                        <span className="text-xs text-green-600 mr-2"> (مضاف)</span>
                                    )}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-4 text-gray-500">
                            <p>لا توجد أدوية في هذه الفئة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicationsList;