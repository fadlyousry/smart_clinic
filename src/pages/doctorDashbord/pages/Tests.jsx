import { useState, useEffect } from 'react';
import { supabase } from "../../../supaBase/booking";


import {
    Search,
    Add,
    FilterList,
    Print,
    Delete,
    Edit,
    LocalHospital,
    Science,
    Bloodtype,
    MonitorHeart,
    MedicalServices,
    Check

} from '@mui/icons-material';

import {
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

const Tests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTests, setSelectedTests] = useState([]);
    const [activeFilter, setActiveFilter] = useState('الكل');
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patients, setPatients] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openAddTest, setOpenAddTest] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editTestData, setEditTestData] = useState(null);
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [searchTermpatient, setSearchTermpatient] = useState('');
    const [isSearchOpenpatient, setIsSearchOpenpatient] = useState(false);




    const filteredPatients = patients.filter((p) =>
        p.fullName.toLowerCase().includes(searchTermpatient.toLowerCase())
    );

    const [newTest, setNewTest] = useState({
        name: "",
        durationValue: "",
        durationUnit: "",
        urgent: false,
        category: ""
    });


    useEffect(() => {
        const fetchPatients = async () => {
            const { data } = await supabase.from("patients").select("id, fullName");
            setPatients(data || []);
        };
        fetchPatients();
    }, []);



    const [categories, setCategories] = useState([]);
    const [testsData, setTestsData] = useState([]);

    useEffect(() => {

        const fetchCategories = async () => {
            const { data } = await supabase.from("test_cat").select("*");
            if (data) setCategories([{ name: 'الكل' }, ...data.map(cat => ({
                name: cat.name,
                color: cat.color,
                icon: <MedicalServices />
            }))]);
        };


        const fetchTests = async () => {
            const { data } = await supabase.from("tests").select("*, test_cat(name, color)");
            if (data) {
                const formatted = data.map(test => ({
                    id: test.id,
                    name: test.name,
                    duration: test.duration,
                    urgent: test.urgent,
                    category: test.test_cat?.name || "غير مصنف",
                    color: test.test_cat?.color || "#999"
                }));
                setTestsData(formatted);
            }
        };

        fetchCategories();
        fetchTests();
    }, []);


    const filteredTests = testsData.filter(test =>
        (activeFilter === 'الكل' || test.category === activeFilter) &&
        (test.name.includes(searchTerm) || test.category.includes(searchTerm))
    );

    const handleSelectTest = (id) => {
        setSelectedTests(prev =>
            prev.includes(id) ? prev.filter(testId => testId !== id) : [...prev, id]
        );
    };

    const finalDuration = `${newTest.durationValue} ${newTest.durationUnit}`;


    const handleAddNewTest = async () => {
        if (!newTest.name || !newTest.durationValue || !newTest.durationUnit || !newTest.category) {
            alert("يرجى إدخال جميع الحقول");
            return;
        }


        const selectedCat = categories.find(c => c.name === newTest.category);
        if (!selectedCat) {
            alert("تصنيف غير صالح");
            return;
        }

        const { data: catRow } = await supabase
            .from("test_cat")
            .select("id")
            .eq("name", newTest.category)
            .single();

        const { error } = await supabase.from("tests").insert({
            name: newTest.name,
            duration: finalDuration,
            urgent: newTest.urgent,
            category_id: catRow?.id
        });

        if (error) {
            console.error(error);
            alert("حدث خطأ أثناء الحفظ");
        } else {
            alert("تم إضافة التحليل بنجاح");
            setOpenAddTest(false);
            setNewTest({ name: '', duration: '', category: '', urgent: false });

            const { data } = await supabase.from("tests").select("*, test_cat(name, color)");
            if (data) {
                const formatted = data.map(test => ({
                    id: test.id,
                    name: test.name,
                    duration: test.duration,
                    urgent: test.urgent,
                    category: test.test_cat?.name || "غير مصنف",
                    color: test.test_cat?.color || "#999"
                }));
                setTestsData(formatted);
            }
        }
    };

    const handleAddTests = async () => {
        if (!selectedPatient || selectedTests.length === 0) {
            alert('اختر مريضاً وبعض التحاليل أولاً');
            return;
        }
        const inserts = selectedTests.map((test_id) => ({
            patient_id: selectedPatient,
            test_id,
            status: 'قيد التنفيذ',
        }));
        const { error } = await supabase.from('test_requests').insert(inserts);
        if (!error) {
            alert('تمت الإضافة بنجاح');
            setSelectedTests([]);
        }
    };


    const handleDeleteTest = async () => {
        if (!testToDelete) return;


        const { data: relatedRequests, error: checkError } = await supabase
            .from('test_requests')
            .select('id')
            .eq('test_id', testToDelete.id)
            .limit(1);

        if (checkError) {
            alert("حدث خطأ أثناء التحقق من الطلبات المرتبطة");
            console.error(checkError);
            return;
        }

        if (relatedRequests && relatedRequests.length > 0) {
            alert("لا يمكن حذف هذا التحليل لأنه مرتبط بطلب تحليل لمريض");
            setDeleteDialogOpen(false);
            setTestToDelete(null);
            return;
        }


        const { error } = await supabase.from("tests").delete().eq("id", testToDelete.id);

        if (error) {
            alert("حدث خطأ أثناء الحذف");
            console.error(error);
        } else {
            setTestsData(prev => prev.filter(test => test.id !== testToDelete.id));
            alert("تم حذف التحليل بنجاح");
        }

        setDeleteDialogOpen(false);
        setTestToDelete(null);
    };



    const handlePrint = () => {
        const selectedData = testsData.filter(test => selectedTests.includes(test.id));
        const printWindow = window.open('', '_blank');

        if (!printWindow) return;

        const htmlContent = `
      <html dir="rtl">
      <head>
        <title>تقرير التحاليل</title>
        <style>
          body { font-family: 'Arial'; padding: 20px; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>تقرير التحاليل</h2>
        <p><strong>اسم المريض:</strong> ${patients.find(p => p.id === selectedPatient)?.fullName || '---'}</p>
        <p><strong>التاريخ:</strong> ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>اسم التحليل</th>
              <th>المدة المتوقعة</th>
            </tr>
          </thead>
          <tbody>
            ${selectedData.map(test => `
              <tr>
                <td>${test.name}</td>
                <td>${test.duration}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 50px;">توقيع الطبيب: ____________________</div>
      </body>
      </html>
    `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="p-5 bg-white min-h-screen rtl">
            <div className="mb-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    التحاليل والفحوصات الطبية <Science className="text-cyan-500 text-3xl" />
                </h2>
            </div>

            <div className="flex gap-2 items-center justify-between mb-5 ">
                {/* Select Box */}
                <div className="w-full sm:max-w-md relative bg-white">
                    <label className="mb-2 text-sm text-gray-600">اختر المريض</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-200"
                        placeholder="ابحث عن مريض..."
                        value={searchTermpatient}
                        onChange={(e) => {
                            setSearchTermpatient(e.target.value);
                            setIsSearchOpenpatient(true);
                        }}
                        onFocus={() => setIsSearchOpenpatient(true)}
                        onBlur={() => setTimeout(() => setIsSearchOpenpatient(false), 150)}
                    />

                    {isSearchOpenpatient && (
                        <ul className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-300 max-h-60 overflow-auto">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                                        onClick={() => {
                                            setSelectedPatient(patient.id);
                                            setSearchTermpatient(patient.fullName);
                                            setIsSearchOpenpatient(false);
                                        }}
                                    >
                                        {patient.fullName}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-500 text-center">لا يوجد نتائج مطابقة</li>
                            )}
                        </ul>
                    )}
                </div>


            </div>
            <div className="flex flex-wrap gap-1 md:gap-3 mb-5 justify-between">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveFilter(cat.name)}
                        className={`flex-1 items-center gap-2 px-2 py-2 rounded-lg border transition  ${activeFilter === cat.name ? 'bg-cyan-100 border-cyan-500' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                        style={{ color: cat.color }}
                    >
                        <span className='hidden md:inline'>{cat.icon}</span> {cat.name}
                    </button>
                ))}
            </div>

            <div className='bg-gray-50 p-5  shadow-sm rounded-2xl'>
                <div className="flex gap-2 items-center justify-between mb-5 ">
                    <div className="relative flex items-center w-full sm:max-w-md  bg-white ">
                        <Search className="absolute left-3 text-gray-400 " />
                        <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="ابحث عن تحليل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">

                        <button className="flex items-center gap-1 bg-teal-600 text-white px-2 py-2 rounded-md h-fit self-end min-w-[130px]"
                            onClick={() => setOpenAddTest(true)}

                        >
                            <Add className="w-4 h-4" />
                            إضافة تحليل
                        </button>
                    </div>
                </div>

                {/* Table view on md+ screens */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-md mt-3 max-h-[50vh] overflow-y-auto">
                    <table className="w-full text-right border-collapse">
                        <thead >
                            <tr className='bg-white text-sm text-gray-600 text-center'>
                                <th className="p-4"><input type="checkbox" onChange={(e) => e.target.checked ? setSelectedTests(testsData.map(test => test.id)) : setSelectedTests([])} /></th>
                                <th className="p-4">اسم التحليل</th>
                                <th className="p-4">التصنيف</th>
                                <th className="p-4">مدة النتيجة</th>
                                <th className="p-4">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.map(test => (
                                <tr key={test.id} className={selectedTests.includes(test.id) ? 'bg-blue-50 border-t border-gray-300 text-center' : 'border-t border-gray-300 text-center'}>
                                    <td className="p-4"><input type="checkbox" checked={selectedTests.includes(test.id)} onChange={() => handleSelectTest(test.id)} /></td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center">
                                            {test.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: categories.find(c => c.name === test.category)?.color + '20', color: categories.find(c => c.name === test.category)?.color }}>
                                            {test.category}
                                        </span>
                                    </td>
                                    <td className="p-4">{test.duration}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            <button
                                                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${selectedTests.includes(test.id)
                                                    ? 'bg-teal-100 text-teal-700'
                                                    : 'text-teal-800 hover:bg-teal-50'
                                                    }`}
                                                onClick={() => handleSelectTest(test.id)}
                                                aria-checked={selectedTests.includes(test.id)}
                                                role="checkbox"
                                            >
                                                {selectedTests.includes(test.id) ? (
                                                    <Check className="text-lg" />
                                                ) : (
                                                    <Add className="text-lg" />
                                                )}
                                            </button>
                                            <button className="text-cyan-500 hover:bg-cyan-50 p-2 rounded-full" onClick={() => {
                                                setEditTestData({
                                                    ...test,
                                                    durationValue: parseInt(test.duration),
                                                    durationUnit: test.duration?.replace(/[0-9]/g, '').trim()
                                                });
                                                setOpenEditDialog(true);
                                            }}><Edit /></button>
                                            <button className="text-red-900 hover:bg-red-50 p-2 rounded-full " onClick={() => {
                                                setTestToDelete(test);
                                                setDeleteDialogOpen(true);
                                            }}>
                                                <Delete /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card view on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden  mt-3 max-h-[50vh] overflow-y-auto">
                    {filteredTests.map(test => (
                        <div key={test.id} className={`p-4 rounded-lg shadow bg-white ${selectedTests.includes(test.id) ? 'border border-blue-400' : ''}`}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">{test.name}</h3>
                            </div>
                            <div className="text-sm mt-1">التصنيف: <span className="font-medium" style={{ color: categories.find(c => c.name === test.category)?.color }}>{test.category}</span></div>
                            <div className="text-sm mt-1">مدة النتيجة: {test.duration}</div>
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex gap-2">
                                    <button
                                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${selectedTests.includes(test.id)
                                            ? 'bg-teal-100 text-teal-700'
                                            : 'text-teal-800 hover:bg-teal-50'
                                            }`}
                                        onClick={() => handleSelectTest(test.id)}
                                        aria-checked={selectedTests.includes(test.id)}
                                        role="checkbox"
                                    >
                                        {selectedTests.includes(test.id) ? (
                                            <Check className="text-lg" />
                                        ) : (
                                            <Add className="text-lg" />
                                        )}
                                    </button>
                                    <button className="text-cyan-500 hover:bg-cyan-50 p-2 rounded-full" onClick={() => {
                                        setEditTestData({
                                            ...test,
                                            durationValue: parseInt(test.duration),
                                            durationUnit: test.duration?.replace(/[0-9]/g, '').trim()
                                        });
                                        setOpenEditDialog(true);
                                    }}><Edit /></button>
                                    <button className="text-red-900 hover:bg-red-50 p-2 rounded-full" onClick={() => {
                                        setTestToDelete(test);
                                        setDeleteDialogOpen(true);
                                    }}><Delete /></button>
                                </div>
                                <input type="checkbox" checked={selectedTests.includes(test.id)} onChange={() => handleSelectTest(test.id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {selectedTests.length > 0 && (
                <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-50 p-4 rounded-xl shadow my-5">
                    <div className="font-medium text-slate-800">{selectedTests.length} عنصر محدد</div>
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center gap-1  px-2 py-2 rounded-md text-white  bg-teal-600" onClick={() => setOpenConfirm(true)}><Add /> إضافة</button>
                        <button className="flex items-center gap-1  px-2 py-2 rounded-md text-white  bg-cyan-500" onClick={handlePrint}
                        ><Print /> طباعة</button>
                    </div>
                </div>
            )}

            {filteredTests.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">لا توجد تحاليل متطابقة مع بحثك</p>
                </div>
            )}


            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>تأكيد الإضافة</DialogTitle>
                <DialogContent>
                    هل تريد إضافة {selectedTests.length} تحليل للمريض المحدد؟
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>إلغاء</Button>
                    <Button onClick={() => {
                        handleAddTests();
                        setOpenConfirm(false);
                    }} variant="contained">تأكيد</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    هل أنت متأكد أنك تريد حذف التحليل: <strong>{testToDelete?.name}</strong>؟
                    <div className="mt-2 text-sm text-gray-600">
                        ملاحظة: لا يمكن حذف التحاليل المرتبطة بطلبات تحاليل للمرضى
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleDeleteTest} color="error" variant="contained">حذف</Button>
                </DialogActions>
            </Dialog>




            {openEditDialog && (
                <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl  max-w-md shadow-xl relative border-2 border-cyan-500 ">
                        <h2 className="text-lg font-bold mb-3 text-cyan-800"><Edit className='text-cyan-800' />تعديل التحليل</h2>
                        <hr className='text-cyan-500 mb-5' />

                        <label className="block mb-2 text-sm">اسم التحليل</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-3"
                            value={editTestData.name}
                            onChange={(e) => setEditTestData({ ...editTestData, name: e.target.value })}
                        />

                        <label className="block mb-2 text-sm">المدة الزمنية</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={editTestData.durationValue}
                                onChange={(e) => setEditTestData({ ...editTestData, durationValue: e.target.value })}
                                placeholder="القيمة"
                                min={1}
                            />
                            <select
                                className="w-40 border p-2 rounded"
                                value={editTestData.durationUnit}
                                onChange={(e) => setEditTestData({ ...editTestData, durationUnit: e.target.value })}
                            >
                                <option value="">الوحدة</option>
                                <option value="دقيقة">دقيقة</option>
                                <option value="ساعة">ساعة</option>
                                <option value="يوم">يوم</option>
                            </select>
                        </div>

                        <label className="block mb-2 text-sm">التصنيف</label>
                        <select
                            className="w-full border p-2 rounded mb-3"
                            value={editTestData.category}
                            onChange={(e) => setEditTestData({ ...editTestData, category: e.target.value })}
                        >
                            <option value="">اختر تصنيف</option>
                            {categories.filter(c => c.name !== "الكل").map((cat, idx) => (
                                <option key={idx} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <label className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                checked={editTestData.urgent}
                                onChange={(e) => setEditTestData({ ...editTestData, urgent: e.target.checked })}
                            />
                            عاجل
                        </label>

                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-cyan-600 text-white px-4 py-2 rounded"
                                onClick={async () => {
                                    if (!editTestData.name || !editTestData.durationValue || !editTestData.durationUnit || !editTestData.category) {
                                        alert("يرجى إدخال كل الحقول");
                                        return;
                                    }

                                    const duration = `${editTestData.durationValue} ${editTestData.durationUnit}`;

                                    const { data: catRow } = await supabase
                                        .from("test_cat")
                                        .select("id")
                                        .eq("name", editTestData.category)
                                        .single();

                                    const { error } = await supabase
                                        .from("tests")
                                        .update({
                                            name: editTestData.name,
                                            duration,
                                            urgent: editTestData.urgent,
                                            category_id: catRow?.id
                                        })
                                        .eq("id", editTestData.id);

                                    if (error) {
                                        console.error(error);
                                        alert("حدث خطأ أثناء التحديث");
                                    } else {
                                        alert("تم تحديث التحليل بنجاح");
                                        setOpenEditDialog(false);
                                        setEditTestData(null);
                                        const { data } = await supabase.from("tests").select("*, test_cat(name, color)").order("id", { ascending: false });
                                        if (data) {
                                            const formatted = data.map(test => ({
                                                id: test.id,
                                                name: test.name,
                                                duration: test.duration,
                                                urgent: test.urgent,
                                                category: test.test_cat?.name || "غير مصنف",
                                                color: test.test_cat?.color || "#999"
                                            }));
                                            setTestsData(formatted);
                                        }
                                    }
                                }}
                            >
                                حفظ
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setOpenEditDialog(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}






            {openAddTest && (
                <div className="fixed inset-0 bg-gray-500/50  flex justify-center items-center z-50 ">
                    <div className="bg-white p-6 rounded-xl  max-w-md shadow-xl relative border-2 border-cyan-500">
                        <h2 className="text-lg font-bold mb-3 text-cyan-800"><Add className='text-cyan-800' />إضافة تحليل جديد</h2>
                        <hr className='text-cyan-500 mb-5 ' />
                        <label className="block mb-2 text-sm">اسم التحليل</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-3"
                            value={newTest.name}
                            onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                        />
                        <label className="block mb-2 text-sm">المدة الزمنية</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={newTest.durationValue}
                                onChange={(e) => setNewTest({ ...newTest, durationValue: e.target.value })}
                                placeholder="القيمة"
                                min={1}
                            />
                            <select
                                className="w-40 border p-2 rounded"
                                value={newTest.durationUnit}
                                onChange={(e) => setNewTest({ ...newTest, durationUnit: e.target.value })}
                            >
                                <option value="">الوحدة</option>
                                <option value="دقيقة">دقيقة</option>
                                <option value="ساعة">ساعة</option>
                                <option value="يوم">يوم</option>
                            </select>
                        </div>


                        <div className="mb-3">
                            <div className="flex justify-between items-center">
                                <label className="block mb-2 text-sm">التصنيف</label>
                                <button
                                    type="button"
                                    className="text-cyan-600 text-sm flex items-center gap-1"
                                    onClick={() => setShowCategoryInput(prev => !prev)}
                                >
                                    <Add fontSize="small" /> إضافة تصنيف
                                </button>
                            </div>



                            {showCategoryInput && (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="اسم التصنيف الجديد"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full border p-2 rounded mb-2"
                                    />
                                    <button
                                        className="bg-cyan-600 text-white px-4 py-1 rounded text-sm"
                                        onClick={async () => {
                                            if (!newCategoryName.trim()) return alert("اكتب اسم التصنيف");
                                            const { error } = await supabase.from("test_cat").insert({
                                                name: newCategoryName,
                                                color: "#00bcd4"
                                            });
                                            if (error) {
                                                alert("حدث خطأ أثناء الإضافة");
                                                return;
                                            }
                                            const { data } = await supabase.from("test_cat").select("*");
                                            if (data) {
                                                setCategories([{ name: 'الكل' }, ...data.map(cat => ({
                                                    name: cat.name,
                                                    color: cat.color,
                                                    icon: <MedicalServices />
                                                }))]);
                                                setNewTest(prev => ({ ...prev, category: newCategoryName }));
                                            }
                                            setNewCategoryName('');
                                            setShowCategoryInput(false);
                                        }}
                                    >
                                        حفظ التصنيف
                                    </button>
                                </div>
                            )}
                            <select
                                className="w-full border p-2 rounded"
                                value={newTest.category}
                                onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                            >
                                <option value="">اختر تصنيف</option>
                                {categories.filter(c => c.name !== "الكل").map((cat, idx) => (
                                    <option key={idx} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <label className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                checked={newTest.urgent}
                                onChange={(e) => setNewTest({ ...newTest, urgent: e.target.checked })}
                            />
                            عاجل
                        </label>
                        <div className="flex justify-end gap-3">
                            <button
                                className="bg-cyan-600 text-white px-4 py-2 rounded"
                                onClick={handleAddNewTest}
                            >
                                حفظ
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setOpenAddTest(false)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tests;


