import React from "react";
import { Calendar } from "lucide-react";
import { Field, ErrorMessage } from "formik";

export function BookingDataInput() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2 text-gray-800">
        <Calendar className="inline w-5 h-5 mr-2 text-teal-600  mx-2" />
        التاريخ المفضل *
      </label>
      <Field
        type="date"
        name="bookingDate"
        required
        min={new Date().toISOString().split("T")[0]}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-right h-[50px]"
        style={{ direction: "rtl" }}
      />
      <ErrorMessage
        name="bookingDate"
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
}
