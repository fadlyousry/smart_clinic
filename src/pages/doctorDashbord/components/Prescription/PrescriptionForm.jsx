import React from 'react';
import PatientSearch from '../PatientSearchPrescription';

const PrescriptionForm = ({
    today,
    selectedPatient,
    onPatientSelect,
    selectedMeds,
    onRemoveMed,
    notes,
    onNotesChange,
    onSubmit,
    onPrint,
    isSubmitting

}) => {
    return (
        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>روشتة العلاج</h2>
                <div className="text-gray-600">
                    <p className="font-medium">التاريخ: {today}</p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">اسم المريض</label>
                <PatientSearch onPatientSelect={onPatientSelect} />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="p-3 grid grid-cols-12 gap-1 font-medium"
                    style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
                    <span className="col-span-5">الدواء</span>
                    <span className="col-span-3">الجرعة</span>
                    <span className="col-span-3">المدة</span>
                    <span className="col-span-1">إزالة</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {selectedMeds.length > 0 ? (
                        selectedMeds.map((med, index) => (
                            <div key={index} className="border-b border-gray-200 p-3 grid grid-cols-12 gap-1 items-center hover:bg-gray-50">
                                <span className="col-span-5 font-medium">{med.name}</span>
                                <span className="col-span-3 text-gray-600">{med.dosage}</span>
                                <span className="col-span-3 text-gray-600">{med.duration}</span>
                                <button
                                    onClick={() => onRemoveMed(index)}
                                    className="col-span-1 text-red-500 hover:text-red-700"
                                >
                                    ✖
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>لا توجد أدوية مضافة</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium text-gray-700">ملاحظات الطبيب</label>
                <textarea
                    value={notes}
                    onChange={onNotesChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    rows="4"
                    placeholder="التشخيص أو أي تعليمات إضافية..."
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    style={{ backgroundColor: isSubmitting ? undefined : "var(--color-accent)" }}
                >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ الروشتة'}
                </button>
                <button
                    onClick={onPrint}
                    disabled={selectedMeds.length === 0 || !selectedPatient}
                    className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${selectedMeds.length === 0 || !selectedPatient ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                    طباعة الروشتة
                </button>
            </div>
        </div>
    );
};

export default PrescriptionForm;