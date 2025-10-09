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
![Dashboard Screenshot](<img width="640" height="400" alt="Screenshot 2025-10-08 182138" src="https://github.com/user-attachments/assets/f08cae23-0596-474d-8974-c2510dd3b964" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181616" src="https://github.com/user-attachments/assets/4f20980b-c130-432f-bc87-ad5e46cfa4b6" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181153" src="https://github.com/user-attachments/assets/997c2474-4ae9-408f-b2ad-ebdfd3b7573a" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181616" src="https://github.com/user-attachments/assets/1932b933-6011-4681-afce-17371aa89d05" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181700" src="https://github.com/user-attachments/assets/d52ad880-252a-4095-92e7-506eb60925bb" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181936" src="https://github.com/user-attachments/assets/eed165fc-9dcd-4d32-90c4-8c684da3ea89" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181956" src="https://github.com/user-attachments/assets/1628c46e-be3a-4bde-a8b3-36f76ff97dca" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181831" src="https://github.com/user-attachments/assets/944c7fc8-07b3-4cb1-9c44-1ad6ae7f5de9" />
<img width="840" height="400" alt="Screenshot 2025-10-08 181920" src="https://github.com/user-attachments/assets/393a432c-bc97-4da1-896c-a983c4afb395" />
)

---

### 📱 Mobile View
![Mobile Screenshot](
<img width="300" height="640" alt="Screenshot 2025-10-08 185748" src="https://github.com/user-attachments/assets/a143ab60-16f2-4ab8-bfed-2c12aae396a6" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185720" src="https://github.com/user-attachments/assets/b6df8799-8060-4d22-970b-64f8b39bdf6c" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185702" src="https://github.com/user-attachments/assets/df866d57-f71c-4bba-9df3-bc5078c28928" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185631" src="https://github.com/user-attachments/assets/9bcc87db-797f-455a-9f28-d27584c42e6f" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185544" src="https://github.com/user-attachments/assets/f4a13a3f-988a-4ad9-a7b2-cf4fdd349ff9" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185530" src="https://github.com/user-attachments/assets/f893e6b5-102c-45e3-822f-696c26217701" />
<img width="300" height="640" alt="Screenshot 2025-10-08 185453" src="https://github.com/user-attachments/assets/225e3670-29e5-49c8-98fc-4f23fc48d9ef" />
)


### 🧑‍⚕️ Appointments & Patients
![Appointments Screenshot](
 <img width="840" height="400" alt="Picture3" src="https://github.com/user-attachments/assets/bbb3ed60-0c10-49a1-83e5-80212c21ccbc" />
<img width="840" height="400" alt="Screenshot 2025-10-08 191003" src="https://github.com/user-attachments/assets/525d5ecc-71de-48c2-9554-579f6a6dabf1" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190910" src="https://github.com/user-attachments/assets/3920810a-3ce0-47b2-8053-15e25257272e" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190902" src="https://github.com/user-attachments/assets/07ca68b4-b905-439f-ae7b-96f5a0b37acc" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190853" src="https://github.com/user-attachments/assets/75ac4d64-db26-42fc-ad73-9ae672939f47" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190837" src="https://github.com/user-attachments/assets/089570ed-116e-409a-a064-14654b709d3f" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190628" src="https://github.com/user-attachments/assets/6d6dbcc0-ff08-4ec6-9f4d-c673f62dc7ec" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190601" src="https://github.com/user-attachments/assets/3ee90a03-45ba-43db-8ba3-b92ecd80d5a5" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190536" src="https://github.com/user-attachments/assets/dfde1e95-1ee3-474e-ba82-69e194de9df4" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190514" src="https://github.com/user-attachments/assets/ee73a478-8ef4-4fb0-a805-4e7139b1f456" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190446" src="https://github.com/user-attachments/assets/8c183e66-4c56-44a4-b0b9-3453c82789a8" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190427" src="https://github.com/user-attachments/assets/96dda029-6dd6-4dce-8e4b-210655b03beb" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190409" src="https://github.com/user-attachments/assets/5be0379a-ad9a-41b6-bcec-5157e87b7dfa" />
<img width="840" height="400" alt="Screenshot 2025-10-08 190358" src="https://github.com/user-attachments/assets/e547b29c-22b7-48cc-950a-abe0ab4f45b4" />

)

---
### 📱 Mobile View
![Mobile Screenshot](
<img width="473" height="884" alt="Screenshot 2025-10-08 191349" src="https://github.com/user-attachments/assets/18ea4592-a716-4d3f-9515-4834f069bf48" />
<img width="497" height="886" alt="Screenshot 2025-10-08 191343" src="https://github.com/user-attachments/assets/f0eaaa3b-8fad-4e85-8f5e-9f17c002de4b" />
<img width="487" height="895" alt="Screenshot 2025-10-08 191300" src="https://github.com/user-attachments/assets/3fde51fb-0a40-4bdc-8073-3b25c0cffd5f" />
<img width="448" height="881" alt="Screenshot 2025-10-08 191239" src="https://github.com/user-attachments/assets/de92ef81-f238-43dd-9d5e-a1f34345df58" />
<img width="577" height="942" alt="Screenshot 2025-10-08 191042" src="https://github.com/user-attachments/assets/220e4772-a349-43a4-97fd-28cc29752fea" />
<img width="463" height="907" alt="Screenshot 2025-10-08 193453" src="https://github.com/user-attachments/assets/d9d57ee5-2764-4cf4-b607-4b0ba647de15" />
)


## ✨ Future Improvements

* Real-time notifications for upcoming appointments.
* Export reports (PDF/Excel) for prescriptions and statistics.


---

