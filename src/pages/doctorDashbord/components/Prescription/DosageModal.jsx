import React from 'react';

const DosageModal = ({
    show,
    onClose,
    currentMed,
    dosage,
    duration,
    onDosageChange,
    onDurationChange,
    onAddMedication,
    dosageOptions,
    durationOptions
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-gray-500/60">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                    تحديد جرعة الدواء: {currentMed}
                </h3>

                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
                    <div className="grid grid-cols-2 gap-2">
                        {dosageOptions?.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onDosageChange(option.value)}
                                className={`p-2 border rounded-lg text-sm ${dosage === option.value ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {option.value}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={dosage}
                        onChange={(e) => onDosageChange(e.target.value)}
                        placeholder="أو اكتب جرعة مخصصة"
                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
                    <div className="grid grid-cols-2 gap-2">
                        {durationOptions?.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onDurationChange(option.value)}
                                className={`p-2 border rounded-lg text-sm ${duration === option.value ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                {option.value}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={duration}
                        onChange={(e) => onDurationChange(e.target.value)}
                        placeholder="أو اكتب مدة مخصصة"
                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                        style={{ backgroundColor: "var(--color-accent)" }}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onAddMedication}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                        disabled={!dosage || !duration}
                        style={{ backgroundColor: "var(--color-accent)" }}
                    >
                        تأكيد وإضافة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DosageModal;