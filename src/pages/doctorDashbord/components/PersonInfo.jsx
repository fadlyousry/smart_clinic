export default function Prescription() {
    return (
        <div className="bg-gray-100 rounded-3xl p-5 flex  md:flex-row gap-5 justify-between items-center md:items-start">

            <table className="table-auto border-collapse w-full md:w-auto border-gray-300">
                <tbody>
                    <tr>
                        <td>الاسم</td>
                        <td><input type="text" value="أحمد" /></td>
                    </tr>
                    <tr>
                        <td>العمر</td>
                        <td><input type="text" value="30" /></td>
                    </tr>
                    <tr>
                        <td>العنوان</td>
                        <td><input type="text" value="القاهرة" /></td>
                    </tr>
                    <tr>
                        <td>النوع</td>
                        <td><input type="text" value="ذكر" /></td>
                    </tr>
                    <tr>
                        <td>فصيله الدم</td>
                        <td><input type="text" value="O+" /></td>
                    </tr>
                    <tr>
                        <td>التلفون </td>
                        <td><input type="text" value="01210677917" /></td>
                    </tr>
                    <tr>
                        <td>الحاله المرضيه</td>
                        <td><input type="text" value="سكر+ ضغط " /></td>
                    </tr>
                </tbody>
            </table>
            <span className="hidden md:inline">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="User Avatar"
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
            </span>
        </div>
    )
}