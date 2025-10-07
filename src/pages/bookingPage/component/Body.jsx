import React from "react";
import { SubmitButton } from "./SubmitButton";
import { NotesInput } from "./NotesInput";
import { VisitTypeInput } from "./VisitTypeInput";
import { BookingDataInput } from "./BookingDataInput";
import { PhoneInput } from "./PhoneInput.jsx";
import { AgeInput } from "./AgeInput.jsx";
import { AddressInput } from "./AddressInput.jsx";
import { NameInput } from "./NameInput.jsx";
import { FormHeader } from "./FormHeader.jsx";
import { Formik, Form } from "formik";

export function Body({ formData, handleSubmit, Schema }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <FormHeader />
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validationSchema={Schema}
      >
        <Form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NameInput />
            <AddressInput />
            <AgeInput />
            <PhoneInput />
            <BookingDataInput />
            <VisitTypeInput />
          </div>
          <div className="mt-5">
            <NotesInput />
          </div>

          <div className="mt-8 flex justify-center">
            <SubmitButton />
          </div>
        </Form>
      </Formik>
    </div>
  );
}
