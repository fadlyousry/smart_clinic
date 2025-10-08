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
   ```<img width="479" height="940" alt="Screenshot 2025-10-08 191054" src="https://github.com/user-attachments/assets/8cc60f02-3c51-4241-a858-57a9e3f6f24d" />
<img width="577" height="942" alt="Screenshot 2025-10-08 191042" src="https://github.com/user-attachments/assets/86b7d431-a37f-408e-bcb1-18bc506f318f" />
<img width="1513" height="900" alt="Screenshot 2025-10-08 190628" src="https://github.com/user-attachments/assets/4e738156-28cc-4c2d-bb98-252c7f524fcb" />
<img width="1380" height="904" alt="Screenshot 2025-10-08 190427" src="https://github.com/user-attachments/assets/f06a23a3-9400-455d-8a03-dcea60bc7681" />
<img width="1528" height="891" alt="Screenshot 2025-10-08 190409" src="https://github.com/user-attachments/assets/57e82aa9-3390-4bf3-b15e-2b7a1a4df61c" />


---
### 🖼️ Screenshots
| Dashboard | Patients | Prescriptions |
|------------|-----------|----------------|
<img width="1547" height="892" alt="Screenshot 2025-10-08 182138" src="https://github.com/user-attachments/assets/0ec62950-aad7-4243-a235-4aa78e0703b7" />
<img width="1521" height="862" alt="Screenshot 2025-10-08 181920" src="https://github.com/user-attachments/assets/6cd56283-3a96-45d3-858e-9c845708eb60" />
<img width="1408" height="866" alt="Screenshot 2025-10-08 181752" src="https://github.com/user-attachments/assets/5e569a14-53cd-4c03-9663-bbcdc75b07c5" />
<img width="1619" height="895" alt="Screenshot 2025-10-08 181700" src="https://github.com/user-attachments/assets/d2524bd6-395c-47c5-b4c1-1d51f8f5e368" />
<img width="808" height="951" alt="Screenshot 2025-10-08 185845" src="https://github.com/user-attachments/assets/0c52ca58-48d9-4782-b0b0-03688a74cc00" />
<img width="1548" height="877" alt="Screenshot 2025-10-08 185350" src="https://github.com/user-attachments/assets/9cb9f479-447e-4376-9b0b-a1c114fde693" />
<img width="1500" height="887" alt="Screenshot 2025-10-08 182047" src="https://github.com/user-attachments/assets/5c89d525-53d0-46bf-b4d2-06870fdb94aa" />
<img width="1544" height="883" alt="Screenshot 2025-10-08 190358" src="https://github.com/user-attachments/assets/eba3b15f-2965-41e8-8789-76b3c6e6a7d8" />
<img width="1481" height="894" alt="Screenshot 2025-10-08 190341" src="https://github.com/user-attachments/assets/f0d67309-7a69-4894-b98c-3635b4de35e9" />
<img width="497" height="886" alt="Screenshot 2025-10-08 191343" src="https://github.com/user-attachments/assets/8765e43f-f430-45aa-a764-bd3e09dcfdfe" />
<img width="454" height="880" alt="Screenshot 2025-10-08 191330" src="https://github.com/user-attachments/assets/21e74990-dd0f-4ea4-bd9a-1a1ce208d64f" />
<img width="463" height="880" alt="Screenshot 2025-10-08 191319" src="https://github.com/user-attachments/assets/ad1f297d-1f70-42aa-a898-438a6f5a21a4" />
<img width="487" height="895" alt="Screenshot 2025-10-08 191300" src="https://github.com/user-attachments/assets/9cd05cfb-cd5b-486b-bfa2-f6acebbb4ce4" />


## ✨ Future Improvements

* Real-time notifications for upcoming appointments.
* Export reports (PDF/Excel) for prescriptions and statistics.


---

