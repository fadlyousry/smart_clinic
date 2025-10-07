import React from "react";
import { FileText } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function NotesInput() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-800">
        <FileText className="inline w-5 h-5 mr-2 text-teal-600  mx-2" />
        ملاحظات إضافية
      </label>
      <Field
        as="textarea"
        name="notes"
        rows="4"
        placeholder="يرجى وصف الأعراض أو أي مخاوف محددة..."
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right resize-none"
        style={{ direction: "rtl" }}
      />
      <ErrorMessage
        name="notes"
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}
