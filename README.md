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
   git clone https://github.com/your-username/health_project.git
   cd health_project
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


## ✨ Future Improvements

* Real-time notifications for upcoming appointments.
* Export reports (PDF/Excel) for prescriptions and statistics.
* Role-specific dashboards for enhanced usability.

---

