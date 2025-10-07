import { Phone } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function PhoneInput() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-800">
        <Phone className="inline w-5 h-5 mr-2 text-teal-600  mx-2" />
        رقم الهاتف *
      </label>
      <Field
        type="tel"
        name="phoneNumber"
        required
        placeholder="أدخل رقم هاتفك"
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right h-[50px]"
        style={{ direction: "rtl" }}
      />
      <ErrorMessage
        name="phoneNumber"
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}
