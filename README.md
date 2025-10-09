<div align="center">
  <img src="https://github.com/user-attachments/assets/01a46170-76f6-4f63-92bb-dc765972231e" alt="Smart Clinic Cover" width="100%" />
</div>

# 🏥 Smart Clinic – Clinic Management System

Smart Clinic is a **comprehensive web-based clinic management system** designed with a strong focus on **UI/UX, real-time data, and responsive design**.
Built using **React.js, Tailwind CSS, Zustand, and Supabase**, the system provides an intuitive interface for doctors, patients, and nurses to efficiently manage clinical operations.

---

## 🚀 Key Features

### 👥 Multi-User Roles

* **Doctor**:

  * Access full patient medical history (visits, prescriptions, lab tests).
  * Create and print prescriptions.
  * Request and review lab tests.
  * View interactive statistics and charts.

* **Patient**:

  * Register/Login securely.
  * Book appointments independently.
  * View prescriptions and dosage details.
  * Access and download lab test results.

* **Nurse**:

  * Book appointments on behalf of patients.
  * Assist doctors in managing treatments and records.

---

### 📅 Appointments Management

* Book, update, cancel, and categorize appointments by date and status (**upcoming, completed, canceled**).
* Doctor dashboard shows daily appointments with direct access to patient records.

---

### 💊 Prescriptions Module

* Generate electronic prescriptions including **medication, dosage, duration**.
* Print-ready prescriptions for patient handover.
* **Easy Prescription Workflow** with streamlined UI for quick entry.
* **Medication Management**: Add/edit medications and categories easily.

---

### 🧪 Lab Tests Management

* Request lab tests for patients.
* Upload and attach results to patient records.
* Patients can securely view their test results.

---

### 📊 Statistics Dashboard (Doctor)

* Interactive charts and visual insights covering:

  * Appointments by status
  * Patients overview
  * Prescriptions count
  * Lab tests status
* Designed for **better usability and decision-making**.

---

### 🎨 UI/UX Highlights

* Clean and minimal design with **Tailwind CSS**.
* Responsive layout for **desktop, tablet, and mobile**.
* Streamlined workflows for doctors and nurses to reduce clicks.

---

### ⚡ Real-time Updates

* Supabase subscriptions implemented to provide **live data updates without page reloads**.

---

## 🗄️ Database Design (Supabase)

* Designed a relational schema covering:

  * **Patients, Doctors, Nurses**
  * **Appointments, Visits**
  * **Prescriptions, Medications, Drug Categories**
  * **Tests & Test Requests**
* Established **One-to-Many and Many-to-Many relationships** for strong data integrity.
* Implemented **Row-Level Security (RLS)** to protect sensitive medical data and enforce role-based access.

---

## 🛠️ Technologies & Tools

* **Frontend**: React.js (with Vite)
* **Styling/UI**: Tailwind CSS
* **Backend & Database**: Supabase (Authentication, Database, Real-time Subscriptions)
* **State Management**: Zustand
* **Development Tools**: Vite.js, ESLint, Git/GitHub

---

## 👨‍⚕️ Demo Accounts

| Role   | Email                                             | Password |
| ------ | ------------------------------------------------- | -------- |
| Doctor | [maldb0907@gmail.com](mailto:maldb0907@gmail.com) | 1111111  |
| Nurse  | [maldb3220@gmail.com](mailto:maldb3220@gmail.com) | 1111111  |

---

## ⚙️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/fadlyousry/smart_clinic.git
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Run the development server:

   ```bash
   npm run dev
   ```
4. App will be available at:

   ```
   http://localhost:5173
   ```

---
## 🖼️ Screenshots


### 💻 Doctor Dashboard View

<div align="center">

<table>
<tr>
  <td><img src="https://github.com/user-attachments/assets/f08cae23-0596-474d-8974-c2510dd3b964" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/997c2474-4ae9-408f-b2ad-ebdfd3b7573a" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/4f20980b-c130-432f-bc87-ad5e46cfa4b6" width="840" height="420" /></td>
</tr>
<tr>
  <td><img src="https://github.com/user-attachments/assets/1628c46e-be3a-4bde-a8b3-36f76ff97dca" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/d52ad880-252a-4095-92e7-506eb60925bb" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/9a60a32b-d88d-4610-8cac-f76a22417ecc" width="840" height="420" /></td>
</tr>
<tr>
  <td><img src="https://github.com/user-attachments/assets/eed165fc-9dcd-4d32-90c4-8c684da3ea89" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/944c7fc8-07b3-4cb1-9c44-1ad6ae7f5de9" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/393a432c-bc97-4da1-896c-a983c4afb395" width="840" height="420" /></td>
</tr>
</table>

</div>

---

### 🧑‍⚕️ Appointments & Patients

<div align="center">


<table>
<tr>
  <td><img src="https://github.com/user-attachments/assets/bbb3ed60-0c10-49a1-83e5-80212c21ccbc" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/96dda029-6dd6-4dce-8e4b-210655b03beb" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/5be0379a-ad9a-41b6-bcec-5157e87b7dfa" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/038267cc-e676-4981-aac8-2a8ad810ae2e" width="840" height="420" /></td>
</tr>
<tr>
  <td><img src="https://github.com/user-attachments/assets/e547b29c-22b7-48cc-950a-abe0ab4f45b4" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/ee73a478-8ef4-4fb0-a805-4e7139b1f456" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/dfde1e95-1ee3-474e-ba82-69e194de9df4" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/8c183e66-4c56-44a4-b0b9-3453c82789a8" width="840" height="420" /></td>
</tr>
<tr>
  <td><img src="https://github.com/user-attachments/assets/525d5ecc-71de-48c2-9554-579f6a6dabf1" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/3920810a-3ce0-47b2-8053-15e25257272e" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/07ca68b4-b905-439f-ae7b-96f5a0b37acc" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/75ac4d64-db26-42fc-ad73-9ae672939f47" width="840" height="420" /></td>
</tr>
<tr>
  <td><img src="https://github.com/user-attachments/assets/6d6dbcc0-ff08-4ec6-9f4d-c673f62dc7ec" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/3ee90a03-45ba-43db-8ba3-b92ecd80d5a5" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/13bf794e-5231-4775-a159-f399e36b6e63" width="840" height="420" /></td>
  <td><img src="https://github.com/user-attachments/assets/1a14ca1f-55cd-42aa-b416-044ef1dc72bb" width="840" height="420" /></td>
</tr>
</table>

</div>


---

### 📱 Mobile View

<div align="center">
Doctor Dashboard 

<table>
<tr>
  <td><img src="https://github.com/user-attachments/assets/225e3670-29e5-49c8-98fc-4f23fc48d9ef" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/f893e6b5-102c-45e3-822f-696c26217701" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/a143ab60-16f2-4ab8-bfed-2c12aae396a6" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/9bcc87db-797f-455a-9f28-d27584c42e6f" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/d9d57ee5-2764-4cf4-b607-4b0ba647de15" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/f4a13a3f-988a-4ad9-a7b2-cf4fdd349ff9" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/df866d57-f71c-4bba-9df3-bc5078c28928" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/b6df8799-8060-4d22-970b-64f8b39bdf6c" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/1d5d493f-8690-4647-b1da-6c04e3b5938e" width="320" height="640" /></td>
</tr>
  </table>
  Patients View
  <table>
  <tr>
  <td><img src="https://github.com/user-attachments/assets/f0eaaa3b-8fad-4e85-8f5e-9f17c002de4b" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/18ea4592-a716-4d3f-9515-4834f069bf48" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/8cf3afa7-7ff1-40aa-a96d-103051363c5d" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/41154b9c-4836-487a-a2d3-335835f0c068" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/a7b4b18f-d3d1-4846-bd6a-f66b971c3028" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/48dc7ca9-5dd3-451e-bae4-b9b99e5d099f" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/3fde51fb-0a40-4bdc-8073-3b25c0cffd5f" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/de92ef81-f238-43dd-9d5e-a1f34345df58" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/220e4772-a349-43a4-97fd-28cc29752fea" width="320" height="640" /></td>
</tr>
</table>
Nurse Dashboard 
<table>
<tr>
  <td><img src="https://github.com/user-attachments/assets/7b728a02-f126-4224-96ed-afc3da3d9035" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/f463bf6f-0568-445f-959f-1da8aca0d2ff" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/68c6f366-9691-4a05-b582-7f3c89af5e01" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/07e8eda8-ba87-4f6d-9132-8343b335218c" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/0123f14c-9bdf-458c-a7b4-28ac382139f0" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/c0db5abc-eda3-429d-bc12-481b17f278cb" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/3d7e6790-5694-46e7-890b-ab449db9e5ca" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/08aed2d1-ced1-4cc1-904a-fed0cca5a4a0" width="320" height="640" /></td>
  <td><img src="https://github.com/user-attachments/assets/e46d0940-372d-4aff-b898-520731c7344c" width="320" height="640" /></td>
</tr>
</table>

</div>
---


## ✨ Future Improvements

* Real-time notifications for upcoming appointments.
* Export reports (PDF/Excel) for prescriptions and statistics.


---

