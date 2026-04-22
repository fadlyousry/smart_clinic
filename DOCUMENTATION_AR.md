<div dir="rtl">

# 📋 توثيق نظام العيادة الذكية - Smart Clinic

## 🏥 نظرة عامة على المشروع

**Smart Clinic** هو نظام إدارة عيادات طبية متكامل مبني بتقنيات الويب الحديثة. يوفر النظام إدارة شاملة لكافة عمليات العيادة من حجز المواعيد، إدارة الكشوفات، كتابة الوصفات الطبية، طلب التحاليل المعملية، وحتى إحصائيات الأداء.

### 🎯 الهدف من النظام
- تسهيل إدارة العيادات الطبية بشكل رقمي متكامل
- ربط جميع أقسام العيادة (الاستقبال، الأطباء، التمريض، المعمل) في نظام واحد
- توفير بيانات لحظية (Real-time) بين جميع المستخدمين
- تحسين تجربة المريض من الحجز حتى انتهاء الكشف

---

## 🛠️ التقنيات المستخدمة

### الـ Frontend (الواجهة الأمامية)

| التقنية | الإصدار | الوصف |
|---------|---------|-------|
| **React** | 19.1.0 | مكتبة بناء واجهات المستخدم |
| **Vite** | 6.3.5 | أداة البناء والتطوير السريعة |
| **React Router DOM** | 7.7.0 | إدارة التنقل بين الصفحات (SPA Routing) |
| **Zustand** | 5.0.6 | إدارة الحالة (State Management) خفيفة وسريعة |
| **TailwindCSS** | 4.1.11 | إطار عمل CSS للتنسيق السريع |
| **Framer Motion** | 12.23.12 | مكتبة الرسوم المتحركة والانيميشن |
| **Recharts** | 3.1.0 | مكتبة الرسوم البيانية والإحصائيات |
| **Chart.js** | 4.5.0 | مكتبة إضافية للرسوم البيانية |

### الـ Backend (الخلفية)

| التقنية | الوصف |
|---------|-------|
| **Supabase** | قاعدة بيانات PostgreSQL + Authentication + Realtime |
| **Supabase Auth** | نظام المصادقة والتسجيل |
| **Supabase Realtime** | البث المباشر لتحديثات قاعدة البيانات |

### مكتبات إضافية مهمة

| المكتبة | الوصف |
|---------|-------|
| **Formik + Yup** | إدارة والتحقق من النماذج (Forms) |
| **SweetAlert2** | نوافذ التنبيهات والتأكيدات الجميلة |
| **React Toastify** | إشعارات Toast |
| **Material UI (MUI)** | مكونات واجهة مستخدم جاهزة |
| **Lucide React** | أيقونات حديثة |
| **FontAwesome** | مجموعة أيقونات شاملة |
| **date-fns** | مكتبة معالجة التواريخ |
| **jsPDF + pdfmake** | إنشاء ملفات PDF |
| **React to Print** | طباعة المكونات مباشرة |
| **React Calendar** | مكون تقويم تفاعلي |
| **React DnD** | سحب وإفلات (Drag and Drop) |
| **React QR Code** | إنشاء أكواد QR |
| **uuid** | إنشاء معرّفات فريدة |

---

## 📁 هيكل المشروع (Project Structure)

```
smart-clinic/
├── 📄 index.html                    # نقطة الدخول الرئيسية
├── 📄 package.json                  # إعدادات المشروع والمكتبات
├── 📄 vite.config.js                # إعدادات Vite
├── 📄 vercel.json                   # إعدادات النشر على Vercel
├── 📄 tailwind.config.js            # إعدادات TailwindCSS
├── 📄 postcss.config.cjs            # إعدادات PostCSS
├── 📄 .env                          # متغيرات البيئة (Supabase Keys)
│
├── 📂 migrations/                   # ملفات ترحيل قاعدة البيانات
│   ├── 001_patient_flow_restructure.sql
│   ├── 002_multi_doctor_support.sql
│   ├── 003_lab_integration.sql
│   ├── 004_test_requests_migration.sql
│   └── 005_add_doctor_to_test_requests.sql
│
├── 📂 public/                       # الملفات الثابتة
│
├── 📂 dist/                         # ملفات الإنتاج (Build Output)
│
└── 📂 src/                          # كود المصدر الرئيسي
    ├── 📄 main.jsx                  # نقطة بداية React
    ├── 📄 App.jsx                   # المكون الجذري للتطبيق
    ├── 📄 App.css                   # التنسيقات العامة
    ├── 📄 index.css                 # التنسيقات الأساسية
    │
    ├── 📂 assets/                   # الصور والملفات الثابتة
    ├── 📂 fonts/                    # الخطوط المخصصة
    │
    ├── 📂 supaBase/                 # إعداد اتصال Supabase
    │   ├── booking.js               # Supabase Client الرئيسي
    │   ├── NursingBooking.js        # Client للتمريض
    │   └── ReceptionBooking.js      # Client للاستقبال
    │
    ├── 📂 lib/                      # المكتبات المساعدة
    │   └── supabaseRealtime.js      # إدارة البث المباشر (Realtime)
    │
    ├── 📂 store/                    # إدارة الحالة (Zustand Stores)
    │   ├── auth.js                  # حالة المصادقة
    │   ├── appointmentStore.js      # حالة المواعيد
    │   ├── doctorDashboardStore.js  # حالة لوحة تحكم الطبيب
    │   ├── prescriptionStore.js     # حالة الوصفات الطبية
    │   ├── patientStore.js          # حالة المرضى
    │   ├── profile.js               # حالة الملف الشخصي
    │   ├── certificateion.js        # حالة الشهادات
    │   ├── experiences.js           # حالة الخبرات
    │   └── firstaid.js              # حالة الإسعافات الأولية
    │
    ├── 📂 routes/                   # إدارة التوجيه
    │   ├── Routes.jsx               # مكون التوجيه الرئيسي
    │   ├── RoutesArr.jsx            # مصفوفة جميع المسارات
    │   └── lazy.js                  # التحميل الكسول (Lazy Loading)
    │
    ├── 📂 forms/                    # قوالب النماذج (Schemas)
    │   └── schema/                  # قوالب التحقق بـ Yup
    │
    ├── 📂 Components/               # المكونات العامة المشتركة
    │   ├── 📂 Home/                 # مكونات الصفحة الرئيسية
    │   ├── 📂 About/                # صفحة عن العيادة
    │   ├── 📂 Contact/              # صفحة التواصل
    │   ├── 📂 Services/             # صفحة الخدمات
    │   ├── 📂 Booking/              # مكون الحجز العام
    │   ├── 📂 Navbar/               # شريط التنقل
    │   ├── 📂 Footer/               # الذيل
    │   ├── 📂 Layout/               # التخطيط الرئيسي
    │   ├── 📂 Chatbot/              # روبوت المحادثة
    │   ├── 📂 Payment/              # نظام الدفع
    │   └── 📂 Notfound/             # صفحة 404
    │
    └── 📂 pages/                    # صفحات التطبيق
        ├── 📂 Auth/                 # صفحات المصادقة
        ├── 📂 doctorDashbord/       # لوحة تحكم الطبيب
        ├── 📂 Reception/            # لوحة تحكم الاستقبال
        ├── 📂 Nursing/              # لوحة تحكم التمريض
        ├── 📂 LabDashboard/         # لوحة تحكم المعمل
        ├── 📂 PatientProfile/       # ملف المريض
        ├── 📂 DoctorProfile/        # ملف الطبيب
        ├── 📂 bookingPage/          # صفحة الحجز
        ├── 📂 FirstAid/             # الإسعافات الأولية
        └── 📂 MedicalArticles/      # المقالات الطبية
```

---

## 👥 أدوار المستخدمين (User Roles)

النظام يدعم **5 أنواع من المستخدمين**، كل نوع له صلاحيات ولوحة تحكم مختلفة:

### 1. 👨‍⚕️ الطبيب (Doctor) - `/DoctorDashboard/*`
| الصلاحية | الوصف |
|----------|-------|
| إدارة الكشوفات | بدء وإنهاء الكشف الطبي |
| كتابة الوصفات | إنشاء وصفات طبية كاملة |
| طلب التحاليل | طلب تحاليل للمرضى من المعمل |
| عرض السجلات | استعراض السجل الطبي الكامل للمريض |
| التقويم | عرض المواعيد في تقويم تفاعلي |
| الإحصائيات | رسوم بيانية لأداء العيادة |
| إدارة الأطباء | إضافة وحذف أطباء (للأدمن فقط) |
| إدارة المعمل | إدارة فنيي المعمل وأنواع التحاليل (للأدمن فقط) |

### 2. 🏥 الاستقبال (Reception) - `/reception-dashboard/*`
| الصلاحية | الوصف |
|----------|-------|
| إدارة المواعيد | إضافة، تعديل، حذف المواعيد |
| إدارة المرضى | تسجيل مرضى جدد وتعديل بياناتهم |
| التقويم | عرض يومي / أسبوعي / شهري للمواعيد |
| الإحصائيات | رسوم بيانية عن المواعيد والإيرادات |
| الإعدادات | تحديد ساعات العمل ومدة المواعيد |
| تغيير الحالات | تحديث حالة المريض (محجوز ← في قاعة الانتظار ← ...) |

### 3. 👩‍⚕️ التمريض (Nurse) - `/nursing-dashboard/*`
| الصلاحية | الوصف |
|----------|-------|
| عرض المواعيد | رؤية مواعيد اليوم |
| إدارة المرضى | عرض وتعديل بيانات المرضى |
| تحديث الحالات | تغيير حالة المريض |

### 4. 🔬 فني المعمل (Lab) - `/lab-dashboard/*`
| الصلاحية | الوصف |
|----------|-------|
| عرض الطلبات | رؤية طلبات التحاليل المعلقة |
| إدخال النتائج | تسجيل نتائج التحاليل |
| الطلبات المكتملة | أرشيف التحاليل المنتهية |
| التقويم | عرض الطلبات على تقويم |

### 5. 🧑‍💼 المستخدم العادي (User) - `/`
| الصلاحية | الوصف |
|----------|-------|
| التصفح | تصفح الموقع والخدمات |
| الحجز | حجز موعد أونلاين |
| الملف الشخصي | عرض الملف الشخصي |

---

## 🔐 نظام المصادقة (Authentication)

### آلية تسجيل الدخول

يستخدم النظام **Supabase Auth** للمصادقة مع دعم نظام أسماء مستخدمين مخصص:

```
📌 كيفية تسجيل الدخول:
- الطبيب/الموظف: اسم مستخدم بدون @ → يُضاف @smartclinic.com تلقائياً
- المستخدم العادي: بريد إلكتروني عادي
```

### تدفق المصادقة (Auth Flow)

```
تسجيل الدخول
    │
    ├─→ التحقق من البيانات عبر Supabase Auth
    │
    ├─→ جلب metadata المستخدم (الدور، الاسم، الرقم)
    │
    ├─→ إذا كان طبيب:
    │   └─→ جلب doctor_id و is_admin من جدول doctors
    │
    ├─→ إذا كان فني معمل:
    │   └─→ جلب lab_id من جدول lab_users
    │
    ├─→ حفظ بيانات المستخدم في Zustand (مع Persist في localStorage)
    │
    └─→ التوجيه حسب الدور:
        ├── doctor    → /DoctorDashboard
        ├── nurse     → /nursing-dashboard
        ├── reception → /reception-dashboard
        ├── lab       → /lab-dashboard
        └── user      → /
```

### Auth Store (`src/store/auth.js`)

يُدار نظام المصادقة عبر Zustand store مع `persist` middleware لحفظ الجلسة:

| الدالة | الوصف |
|--------|-------|
| `login()` | تسجيل الدخول بالبريد/اسم المستخدم وكلمة المرور |
| `register()` | تسجيل حساب جديد |
| `logout()` | تسجيل الخروج |
| `handleForgotPassword()` | إرسال رابط استعادة كلمة المرور |
| `updatePassword()` | تحديث كلمة المرور |
| `CUname()` | جلب اسم المستخدم الحالي |
| `CUrole()` | جلب دور المستخدم الحالي |
| `CUdoctorId()` | جلب ID الطبيب الحالي |
| `CUisAdmin()` | هل المستخدم أدمن؟ |

### حماية المسارات (Route Guards)

كل لوحة تحكم تتحقق من الدور قبل العرض:

```javascript
// مثال: لوحة تحكم الطبيب
if (CUrole() != 'doctor') location.replace('/notFound');

// مثال: لوحة تحكم الاستقبال
if (CUrole() !== 'reception' && CUrole() !== 'admin') {
  location.replace('/notFound');
}

// مثال: لوحة تحكم المعمل
if (CUrole() !== 'lab') location.replace('/notFound');
```

---

## 🗄️ قاعدة البيانات (Database Schema)

### الجداول الرئيسية

#### 1. جدول المرضى `patients`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد (Primary Key) |
| `fullName` | VARCHAR | اسم المريض الكامل |
| `phoneNumber` | VARCHAR | رقم الهاتف (فريد لكل مريض) |
| `address` | VARCHAR | العنوان |
| `age` | INT | العمر |

#### 2. جدول الأطباء `doctors`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `name` | VARCHAR | اسم الطبيب |
| `user_id` | UUID | ربط بحساب المصادقة `auth.users` |
| `is_admin` | BOOLEAN | هل الطبيب أدمن؟ (افتراضي: false) |
| `is_active` | BOOLEAN | هل الحساب نشط؟ (افتراضي: true) |
| `specialization` | TEXT | التخصص |
| `fees` | NUMERIC | رسوم الكشف |

#### 3. جدول المواعيد `appointments`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `date` | TIMESTAMP | تاريخ ووقت الموعد |
| `status` | VARCHAR | حالة الموعد |
| `reason` | TEXT | سبب الزيارة / ملاحظات |
| `payment` | BOOLEAN | حالة الدفع |
| `cancelled` | BOOLEAN | هل ملغى؟ |
| `amount` | NUMERIC | المبلغ المطلوب |
| `patient_id` | INT | FK → patients |
| `doctor_id` | INT | FK → doctors |
| `visitType` | VARCHAR | نوع الزيارة (كشف/متابعة/استشارة) |
| `time` | VARCHAR | وقت الحضور |

#### حالات المواعيد:

```
محجوز → في قاعة الانتظار → في الكشف → تم
                                     ↘ ملغى
```

| الحالة | الوصف |
|--------|-------|
| `محجوز` | تم حجز الموعد ولم يصل المريض بعد |
| `في قاعة الانتظار` | المريض وصل وينتظر دوره |
| `في الكشف` | المريض عند الطبيب حالياً |
| `تم` | انتهى الكشف |
| `ملغى` | تم إلغاء الموعد |

#### 4. جدول الزيارات `visits`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `appointment_id` | INT | FK → appointments |
| `patient_id` | INT | FK → patients |
| `doctor_id` | INT | FK → doctors |
| `date` | TIMESTAMP | تاريخ الزيارة |
| `notes` | TEXT | ملاحظات الزيارة |

#### 5. جدول السجل الطبي `medical_records`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `diagnosis` | TEXT | التشخيص |
| `notes` | TEXT | ملاحظات طبية |

#### 6. جدول الوصفات `prescriptions`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `visit_id` | INT | FK → visits |
| `date` | TIMESTAMP | تاريخ الوصفة |
| `notes` | TEXT | ملاحظات الوصفة |

#### 7. جدول أدوية الوصفة `prescription_medications`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `prescription_id` | INT | FK → prescriptions |
| `medication_id` | INT | FK → medications |
| `dosage` | VARCHAR | الجرعة |
| `duration` | VARCHAR | مدة الاستخدام |
| `instructions` | TEXT | تعليمات خاصة |

#### 8. جدول الأدوية `medications`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `name` | VARCHAR | اسم الدواء |

#### 9. جدول فئات الأدوية `drug_categories`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `name` | VARCHAR | اسم الفئة |

#### 10. جدول التحاليل `tests`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `name` | VARCHAR | اسم التحليل |
| `duration` | VARCHAR | المدة المتوقعة |
| `urgent` | BOOLEAN | هل التحليل عاجل؟ |
| `category_id` | INT | فئة التحليل |
| `created_at` | TIMESTAMP | تاريخ الإنشاء |

#### 11. جدول طلبات التحاليل `test_requests`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `patient_id` | INT | FK → patients |
| `test_id` | INT | FK → tests |
| `doctor_id` | INT | FK → doctors |
| `result` | TEXT | النتيجة |
| `status` | VARCHAR | الحالة (قيد التنفيذ / مكتمل) |
| `result_value` | TEXT | قيمة النتيجة |
| `lab_notes` | TEXT | ملاحظات المعمل |
| `completed_by` | INT | FK → lab_users |
| `completed_at` | TIMESTAMP | تاريخ الإكمال |
| `created_at` | TIMESTAMP | تاريخ الإنشاء |

#### 12. جدول مستخدمي المعمل `lab_users`

| العمود | النوع | الوصف |
|--------|-------|-------|
| `id` | SERIAL | المعرّف الفريد |
| `name` | VARCHAR | اسم فني المعمل |
| `user_id` | UUID | FK → auth.users |
| `phone` | VARCHAR | رقم الهاتف |
| `is_active` | BOOLEAN | هل الحساب نشط؟ |

#### 13. جداول مساعدة

| الجدول | الوصف |
|--------|-------|
| `dosage_options` | خيارات الجرعات المتاحة |
| `duration_options` | خيارات مدد الاستخدام |
| `lab_requests` | طلبات المعمل (قديم) |

### 📊 مخطط العلاقات (Entity Relationships)

```
patients ←──── appointments ────→ doctors
    │                                 │
    ├──── visits ─────────────────────┘
    │        │
    │        ├──── medical_records
    │        │
    │        └──── prescriptions
    │                    │
    │                    └──── prescription_medications ──→ medications
    │                                                          │
    │                                              drug_categories
    │
    └──── test_requests ──→ tests
              │
              └──→ lab_users (completed_by)
              │
              └──→ doctors (doctor_id)
```

---

## 📦 إدارة الحالة (State Management)

يستخدم النظام **Zustand** لإدارة الحالة. هناك عدة stores:

### 1. `doctorDashboardStore.js` - المتجر الرئيسي

هذا هو أهم store في النظام. يحتوي على جميع البيانات الأساسية:

```javascript
// البيانات المُخزنة:
{
  appointments: [],        // جميع المواعيد
  patients: [],             // جميع المرضى (مع visits و test_requests)
  doctors: [],              // جميع الأطباء
  prescriptions: [],        // الوصفات الطبية
  tests: [],                // أنواع التحاليل
  test_requests: [],        // طلبات التحاليل
  drug_categories: [],      // فئات الأدوية
  dosage_options: [],       // خيارات الجرعات
  duration_options: [],     // خيارات المدد
  currentVisit: null,       // الكشف الحالي
  selectedPatient: null,    // المريض المحدد
  loading: false,
  error: null,
}
```

#### الدوال الرئيسية:

| الدالة | الوصف |
|--------|-------|
| `fetchData()` | جلب جميع البيانات من قاعدة البيانات (مرة واحدة عند البداية) |
| `fetchSelectedPatient(id)` | جلب بيانات مريض محدد بالكامل |
| `refreshSelectedPatient()` | تحديث بيانات المريض المحدد حالياً |
| `startVisit(appointmentId)` | بدء كشف (مع منع أكثر من كشف في نفس الوقت) |
| `endVisit(appointmentId)` | إنهاء الكشف وإنشاء زيارة جديدة |
| `exetVisit(appointmentId)` | إلغاء الكشف |
| `updateAppointmentStatus()` | تحديث حالة الموعد |

#### تدفق بدء الكشف:

```
startVisit(appointmentId)
    │
    ├─→ التحقق: هل يوجد مريض في الكشف حالياً؟
    │   ├── نعم → إرجاع خطأ "يوجد مريض في الكشف"
    │   └── لا → المتابعة
    │
    ├─→ تحديث حالة الموعد إلى "في الكشف" في Supabase
    │
    └─→ تحديث الحالة المحلية (appointments + currentVisit)
```

#### تدفق إنهاء الكشف:

```
endVisit(appointmentId)
    │
    ├─→ جلب بيانات الموعد من Supabase
    │
    ├─→ تحديث الحالة إلى "تم"
    │
    ├─→ إنشاء سجل زيارة جديد (visits)
    │
    └─→ تحديث الحالة المحلية
```

### 2. `appointmentStore.js` - متجر المواعيد

خاص بالاستقبال والتمريض. يوفر إدارة كاملة للمواعيد:

| الدالة | الوصف |
|--------|-------|
| `fetchAppointments()` | جلب جميع المواعيد مع بيانات المرضى والأطباء |
| `addAppointment()` | إضافة موعد جديد |
| `updateAppointment()` | تعديل بيانات موعد |
| `deleteAppointment()` | حذف موعد |
| `togglePaymentStatus()` | تبديل حالة الدفع |
| `toggleCancelledStatus()` | تبديل حالة الإلغاء |
| `reorderAppointments()` | إعادة ترتيب المواعيد (سحب وإفلات) |

### 3. `prescriptionStore.js` - متجر الوصفات

يدير الوصفات الطبية مع دعم Realtime:

| الدالة | الوصف |
|--------|-------|
| `fetchMedicationData()` | جلب قائمة الأدوية والفئات |
| `addMedication()` | إضافة دواء للوصفة الحالية |
| `removeMedication()` | حذف دواء من الوصفة |
| `savePrescription()` | حفظ الوصفة في قاعدة البيانات |
| `fetchPatientPrescriptions()` | جلب جميع وصفات مريض محدد |
| `initRealtime()` | بدء الاستماع لتحديثات الوصفات |
| `cleanupRealtime()` | تنظيف قنوات Realtime |

---

## 🔄 نظام البث المباشر (Realtime System)

### الوصف

يستخدم النظام **Supabase Realtime** لمزامنة البيانات بين جميع المستخدمين المتصلين لحظياً. أي تغيير في قاعدة البيانات ينعكس فوراً على جميع الشاشات.

### الملف الرئيسي: `src/lib/supabaseRealtime.js`

### الجداول المراقَبة:

| الجدول | أحداث | الإجراء عند التحديث |
|--------|-------|---------------------|
| `patients` | INSERT / UPDATE / DELETE | إعادة جلب جميع البيانات |
| `appointments` | INSERT / UPDATE / DELETE | تحديث المواعيد محلياً |
| `visits` | INSERT / UPDATE / DELETE | تحديث المريض المحدد |
| `prescriptions` | INSERT / UPDATE / DELETE | إعادة جلب البيانات + تحديث وصفات المريض |
| `prescription_medications` | INSERT / UPDATE / DELETE | إعادة جلب البيانات |
| `test_requests` | INSERT / UPDATE / DELETE | إعادة جلب البيانات |
| `tests` | INSERT / UPDATE / DELETE | تحديث قائمة التحاليل محلياً |
| `drug_categories` | INSERT / UPDATE / DELETE | تحديث فئات الأدوية محلياً |

### إدارة القنوات:

```javascript
// إنشاء قناة عامة أو مخصصة لمريض
setupRealtimePatients(patientId?)

// حذف قناة
removeRealtimeChannel(channel)

// تنظيف جميع القنوات
cleanupAllChannels()

// عرض القنوات النشطة
getActiveChannels()
```

### 🔊 تنبيهات صوتية

لوحة تحكم المعمل تُصدر **صوت تنبيه** عند وصول طلب تحليل جديد:

```javascript
// عند حدث INSERT في test_requests
if (payload.eventType === 'INSERT') {
  playNotificationSound();
}
```

---

## 🗺️ خريطة التوجيه (Routing Map)

### المسارات العامة (Public Routes)

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| `/` | الرئيسية | الصفحة الرئيسية للموقع |
| `/about` | عن العيادة | معلومات عن العيادة |
| `/contact` | تواصل معنا | نموذج التواصل |
| `/services` | الخدمات | خدمات العيادة |
| `/booking` | الحجز | صفحة حجز الموعد |
| `/login` | تسجيل الدخول | صفحة تسجيل الدخول |
| `/register` | التسجيل | إنشاء حساب جديد |
| `/forgetpassword` | نسيت كلمة المرور | استعادة كلمة المرور |
| `/resetpassword` | إعادة تعيين | صفحة إعادة تعيين كلمة المرور |
| `/bookingpage` | صفحة الحجز | نموذج الحجز الكامل |
| `/firstaid` | الإسعافات الأولية | محتوى الإسعافات الأولية |
| `/MedicalArticles` | المقالات الطبية | مقالات طبية تثقيفية |
| `/profile` | الملف الشخصي | ملف الطبيب العام |
| `*` | 404 | صفحة غير موجودة |

### مسارات الطبيب `/DoctorDashboard/*`

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| ` ` (الجذر) | الرئيسية | لوحة تحكم الطبيب الرئيسية |
| `appointments` | المواعيد | قائمة المواعيد الخاصة بالطبيب |
| `patients` | المرضى | قائمة المرضى |
| `records` | السجلات | السجلات الطبية للمرضى |
| `prescription` | الوصفات | كتابة وإدارة الوصفات |
| `tests` | التحاليل | طلب وإدارة التحاليل |
| `statistics` | الإحصائيات | رسوم بيانية وإحصائيات |
| `calendar` | التقويم | تقويم المواعيد |
| `DoctorDashProfile` | الملف الشخصي | ملف الطبيب الشخصي |
| `doctor-management` | إدارة الأطباء | إضافة / حذف أطباء (أدمن) |
| `lab-management` | إدارة المعمل | إدارة فنيي المعمل والتحاليل (أدمن) |

### مسارات الاستقبال `/reception-dashboard/*`

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| ` ` (الجذر) | المواعيد | قائمة المواعيد (الافتراضية) |
| `calendar` | التقويم | تقويم تفاعلي للمواعيد |
| `patients` | المرضى | قائمة المرضى |
| `statistics` | الإحصائيات | إحصائيات العيادة |
| `settings` | الإعدادات | ساعات العمل ومدة المواعيد |

### مسارات التمريض `/nursing-dashboard/*`

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| ` ` (الجذر) | المواعيد | قائمة مواعيد اليوم |
| `patients` | المرضى | قائمة المرضى |

### مسارات المعمل `/lab-dashboard/*`

| المسار | الصفحة | الوصف |
|--------|--------|-------|
| ` ` (الجذر) | الطلبات المعلقة | طلبات التحاليل قيد التنفيذ |
| `completed` | الطلبات المكتملة | أرشيف التحاليل المنتهية |
| `calendar` | التقويم | تقويم الطلبات |

---

## 📘 الوحدات التفصيلية (Detailed Modules)

---

### 📋 الوحدة 1: لوحة تحكم الطبيب (Doctor Dashboard)

**المسار:** `src/pages/doctorDashbord/`

#### الهيكل:

```
doctorDashbord/
├── 📂 pages/                        # صفحات لوحة التحكم
│   ├── DoctorDashbord.jsx           # التخطيط الرئيسي (Layout + Routes)
│   ├── Home.jsx                     # الصفحة الرئيسية
│   ├── Appointments.jsx             # إدارة المواعيد
│   ├── Patients.jsx                 # قائمة المرضى
│   ├── Records.jsx                  # السجلات الطبية
│   ├── Prescription.jsx             # إدارة الوصفات
│   ├── PrescriptionModel.jsx        # نموذج كتابة الوصفة
│   ├── Tests.jsx                    # إدارة التحاليل
│   ├── Statistics.jsx               # الإحصائيات
│   ├── DoctorCalendar.jsx           # التقويم
│   ├── DoctorManagement.jsx         # إدارة الأطباء (أدمن)
│   └── LabManagement.jsx            # إدارة المعمل (أدمن)
│
├── 📂 components/                   # المكونات
│   ├── SideBar.jsx + SideBar.css    # القائمة الجانبية
│   ├── Topbar.jsx + TopBar.css      # الشريط العلوي
│   ├── AppointmentList.jsx          # قائمة الكشوفات
│   ├── AppointmentSummary.jsx       # ملخص المواعيد
│   ├── CurrentPatient.jsx           # المريض الحالي في الكشف
│   ├── StatsCards.jsx               # كروت الإحصائيات
│   ├── CalendarView.jsx             # عرض التقويم المصغر
│   ├── SearchBar.jsx                # شريط البحث
│   ├── PersonInfo.jsx               # معلومات الشخص
│   ├── PrescriptionSheet.jsx        # ورقة الوصفة للطباعة
│   ├── PatientSearchPrescription.jsx # بحث المرضى للوصفات
│   │
│   ├── 📂 Prescription/             # مكونات الوصفة
│   ├── 📂 appointments/             # مكونات المواعيد
│   ├── 📂 recordes/                 # مكونات السجلات الطبية
│   │   ├── PatientSearch.jsx        # بحث عن مريض
│   │   ├── PatientProfile.jsx       # ملف المريض
│   │   ├── PatientInfo.jsx          # معلومات المريض
│   │   ├── VisitsHistory.jsx        # تاريخ الزيارات
│   │   └── TestsModal.jsx           # نافذة التحاليل
│   │
│   └── 📂 statistics/              # مكونات الإحصائيات
│       ├── MonthlyPatientsChart.jsx  # رسم بياني للمرضى الشهري
│       ├── VisitTypePie.jsx         # دائرة أنواع الزيارات
│       ├── RevenueChart.jsx         # رسم بياني للإيرادات
│       ├── RevenueSummary.jsx       # ملخص الإيرادات
│       ├── TopMedicationsChart.jsx  # أكثر الأدوية وصفاً
│       └── QuickStats.jsx           # إحصائيات سريعة
│
└── 📂 hooks/
    └── useRealtime.js               # Hook مخصص للبث المباشر
```

#### الشاشة الرئيسية (Home)

تعرض:
- **كروت إحصائية**: عدد المنتظرين، إجمالي مواعيد اليوم
- **كروت أنواع الزيارات**: كشف، متابعة، استشارة
- **قائمة كشوفات اليوم**: المرضى في قاعة الانتظار وفي الكشف
- **المريض الحالي**: عرض المريض الذي في الكشف حالياً
- **تقويم مصغر**: عرض تقويم للمواعيد

#### آلية الكشف:

```
المريض في قاعة الانتظار
    │
    ├─→ الطبيب يضغط "بدء الكشف" (startVisit)
    │   └─→ تتحقق: لا يوجد كشف نشط حالياً
    │
    ├─→ الحالة تتغير إلى "في الكشف"
    │
    ├─→ الطبيب يكتب الوصفة / يطلب تحاليل / يسجل التشخيص
    │
    ├─→ الطبيب يضغط "إنهاء الكشف" (endVisit)
    │   ├─→ الحالة تتغير إلى "تم"
    │   └─→ يتم إنشاء سجل زيارة (visit) جديد
    │
    └─→ أو يضغط "إلغاء" (exetVisit)
        └─→ الحالة تتغير إلى "ملغى"
```

---

### 🏥 الوحدة 2: لوحة تحكم الاستقبال (Reception Dashboard)

**المسار:** `src/pages/Reception/`

#### الهيكل:

```
Reception/
├── ReceptionLayout.jsx              # التخطيط الرئيسي
├── ReceptionLayout.css              # تنسيقات التخطيط
├── ReceptionAppointments.jsx        # صفحة المواعيد
├── ReceptionCalendar.jsx            # صفحة التقويم
├── ReceptionPatientsList.jsx        # صفحة المرضى
├── ReceptionStatistics.jsx          # صفحة الإحصائيات
├── ReceptionSettings.jsx            # صفحة الإعدادات
├── receptionBookingSchema.js        # قالب التحقق من بيانات الحجز
│
├── 📂 components/
│   ├── ReceptionSidebar.jsx         # القائمة الجانبية
│   ├── ReceptionTopBar.jsx          # الشريط العلوي
│   ├── AppointmentModal.jsx         # نافذة إضافة/تعديل موعد
│   ├── AppointmentViewModal.jsx     # نافذة عرض تفاصيل الموعد
│   ├── AppointmentTable.jsx         # جدول المواعيد
│   ├── AppointmentRow.jsx           # صف الموعد في الجدول
│   ├── AppointmentSearchBar.jsx     # بحث المواعيد
│   ├── AppointmentStats.jsx         # كروت الإحصائيات
│   ├── AppointmentCharts.jsx        # الرسوم البيانية
│   ├── PatientModal.jsx             # نافذة إضافة/تعديل مريض
│   ├── PatientTable.jsx             # جدول المرضى
│   ├── PatientCards.jsx             # كروت المرضى
│   ├── ErrorBoundary.jsx            # حدود الخطأ
│   │
│   └── 📂 calendar/                 # مكونات التقويم المتقدم
│       ├── CalendarToolbar.jsx      # شريط أدوات التقويم
│       ├── CalendarFilters.jsx      # فلاتر التقويم
│       ├── DailyTimeline.jsx        # العرض اليومي
│       ├── WeeklyView.jsx           # العرض الأسبوعي
│       ├── MonthlyView.jsx          # العرض الشهري
│       ├── EnhancedListView.jsx     # عرض القائمة المحسّن
│       ├── AppointmentCard.jsx      # كرت الموعد في التقويم
│       ├── DateNavigator.jsx        # التنقل بين التواريخ
│       └── QuickStats.jsx           # إحصائيات سريعة
│
├── 📂 hooks/                        # Hooks مخصصة
└── 📂 utils/                        # أدوات مساعدة
    └── calendarHelpers.js           # دوال مساعدة للتقويم
```

#### مميزات نظام التقويم:

- **4 أوضاع للعرض**: يومي / أسبوعي / شهري / قائمة
- **فلاتر متقدمة**: حسب الطبيب، الحالة، نوع الزيارة
- **تنقل بين التواريخ**: تقدم/رجوع/اليوم
- **كروت المواعيد التفاعلية**: عرض تفاصيل الموعد مع أزرار سريعة
- **إعدادات قابلة للتخصيص**: ساعات العمل، مدة الموعد، الفترات الزمنية

#### إعدادات العيادة:

| الإعداد | الخيارات | الوصف |
|---------|----------|-------|
| ساعات العمل | لكل يوم من أيام الأسبوع | تحديد من/إلى + تفعيل/إيقاف |
| مدة الموعد | 15 / 20 / 30 / 45 / 60 دقيقة | المدة الافتراضية لكل موعد |
| الفترات الزمنية | 15 / 30 / 60 دقيقة | الفترة بين كل خانة في العرض اليومي |

---

### 👩‍⚕️ الوحدة 3: لوحة تحكم التمريض (Nursing Dashboard)

**المسار:** `src/pages/Nursing/`

#### الهيكل:

```
Nursing/
├── NursingLayout.jsx                # التخطيط الرئيسي (بدون Sidebar)
├── NursingAppointments.jsx          # صفحة المواعيد
├── NursingPatientsList.jsx          # صفحة المرضى
├── nursingBookingSchema.js          # قالب التحقق
│
└── 📂 components/                   # مكونات مشابهة للاستقبال
    ├── NursingSidebar.jsx           # القائمة الجانبية
    ├── NursingTopBar.jsx            # الشريط العلوي
    ├── AppointmentModal.jsx         # نافذة الموعد
    ├── AppointmentTable.jsx         # جدول المواعيد
    ├── PatientModal.jsx             # نافذة المريض
    ├── PatientTable.jsx             # جدول المرضى
    └── ... (مكونات مشتركة)
```

---

### 🔬 الوحدة 4: لوحة تحكم المعمل (Lab Dashboard)

**المسار:** `src/pages/LabDashboard/`

#### الهيكل:

```
LabDashboard/
├── LabLayout.jsx + LabLayout.css    # التخطيط الرئيسي
├── LabHome.jsx                      # الصفحة الرئيسية (الطلبات المعلقة)
│
├── 📂 components/
│   ├── LabSidebar.jsx + css         # القائمة الجانبية
│   ├── LabTopbar.jsx + css          # الشريط العلوي
│   └── LabResultModal.jsx           # نافذة إدخال نتيجة التحليل
│
└── 📂 pages/
    ├── CompletedRequests.jsx        # الطلبات المكتملة (الأرشيف)
    └── LabCalendar.jsx              # تقويم الطلبات
```

#### سير عمل المعمل:

```
طبيب يطلب تحليل للمريض
    │
    ├─→ يتم إنشاء test_request بحالة "قيد التنفيذ"
    │
    ├─→ 🔔 يصدر صوت تنبيه في لوحة المعمل (Realtime)
    │
    ├─→ فني المعمل يرى الطلب في قائمة الطلبات المعلقة
    │
    ├─→ يضغط "إدخال النتيجة"
    │   ├─→ يفتح LabResultModal
    │   ├─→ يكتب النتائج + ملاحظات المعمل
    │   └─→ يحفظ → يتم تحديث الحالة إلى "مكتمل"
    │
    ├─→ 🔄 النتيجة تظهر فوراً عند الطبيب (Realtime)
    │
    └─→ الطلب ينتقل لأرشيف الطلبات المكتملة
```

---

### 🌐 الوحدة 5: الموقع العام (Public Website)

**المسار:** `src/Components/`

#### مكونات الصفحة الرئيسية:

| المكون | الوصف |
|--------|-------|
| `HeroSection.jsx` | القسم الرئيسي الترحيبي |
| `DoctorServices.jsx` | عرض خدمات الأطباء |
| `AboutClinic.jsx` | معلومات عن العيادة |
| `WhyChooseUs.jsx` | لماذا تختارنا؟ |
| `Testimonials.jsx` | آراء المرضى |
| `MedicalResourcesSection.jsx` | مصادر طبية |
| `AppDownloadSection.jsx` | قسم تحميل التطبيق |
| `ContactUs.jsx` | نموذج التواصل |
| `LoadingSpinner.jsx` | مؤشر التحميل |

#### صفحات إضافية:

| الصفحة | الوصف |
|--------|-------|
| `FirstAid` | دليل الإسعافات الأولية التفاعلي |
| `MedicalArticles` | مقالات طبية من ملف JSON (45+ مقال) |
| `PatientProfile` | ملف المريض الشامل |
| `DoctorProfile` | ملف الطبيب مع الشهادات والخبرات |

---

## 🎨 نظام التصميم (Design System)

### الألوان الرئيسية

| اللون | الكود | الاستخدام |
|-------|-------|-----------|
| **Primary (Cyan)** | `#0097A7` | الأزرار الرئيسية، الروابط، العناصر النشطة |
| **Primary Light** | `var(--color-primary-light)` | خلفيات فاتحة |
| **Primary Dark** | `var(--color-primary-dark)` | نصوص داكنة |
| **Accent** | `var(--color-accent)` | العناصر المميزة |

### الخطوط

| الخط | الاستخدام |
|------|-----------|
| **Tajawal** | الخط الرئيسي العربي (بأوزان 200-900) |
| **M PLUS Rounded 1c** | خط ثانوي |
| **Pangolin** | خط خاص |

### التخطيط العام (Layout)

```
┌──────────────────────────────────────────┐
│ TopBar (الشريط العلوي)                   │
├────────┬─────────────────────────────────┤
│        │                                 │
│ Sidebar│      Content Area               │
│ القائمة │      منطقة المحتوى              │
│ الجانبية│                                 │
│        │                                 │
│        │                                 │
└────────┴─────────────────────────────────┘
```

- **اتجاه الصفحة**: من اليمين لليسار (RTL)
- **القائمة الجانبية**: ثابتة على الشاشات الكبيرة، قابلة للفتح/الإغلاق على الموبايل
- **الشريط العلوي**: يحتوي على اسم المستخدم + زر القائمة + زر تسجيل الخروج

---

## 🔧 متغيرات البيئة (Environment Variables)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

> ⚠️ **تحذير**: لا تشارك المفتاح السري (service_role key) أبداً في الكود أمامي!

---

## 🚀 تشغيل المشروع

### المتطلبات

- **Node.js**: إصدار 18 أو أحدث
- **npm**: مدير الحزم
- **حساب Supabase**: مع مشروع فعال

### خطوات التشغيل

```bash
# 1. تثبيت المكتبات
npm install

# 2. إعداد متغيرات البيئة
# إنشاء ملف .env وإضافة مفاتيح Supabase

# 3. تشغيل بيئة التطوير
npm run dev

# 4. بناء نسخة الإنتاج
npm run build

# 5. معاينة نسخة الإنتاج
npm run preview
```

### النشر (Deployment)

المشروع مُعد للنشر على **Vercel**:

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

**رابط الإنتاج**: `https://health-project-mu.vercel.app/`

---

## 📊 ملفات الترحيل (Database Migrations)

### Migration 001: إعادة هيكلة تدفق المريض

```sql
-- ربط الأطباء بحسابات المصادقة
ALTER TABLE doctors ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- توحيد حالات المواعيد
-- "في الإنتظار" → "محجوز" (مستقبلية) أو "في قاعة الانتظار" (قديمة)
-- "وصل العيادة" → "في قاعة الانتظار"
-- "ملغي" → "ملغى" (توحيد الإملاء)
```

### Migration 002: دعم الأطباء المتعددين

```sql
-- إضافة أعمدة إدارية
ALTER TABLE doctors ADD COLUMN is_admin BOOLEAN DEFAULT false;
ALTER TABLE doctors ADD COLUMN is_active BOOLEAN DEFAULT true;
ALTER TABLE doctors ADD COLUMN specialization TEXT;
```

### Migration 003: تكامل المعمل

```sql
-- إنشاء جدول مستخدمي المعمل
CREATE TABLE lab_users (...);

-- إنشاء جدول طلبات المعمل
CREATE TABLE lab_requests (...);
```

### Migration 004: تحديث طلبات التحاليل

```sql
-- إضافة أعمدة للنتائج والتعقب
ALTER TABLE test_requests ADD COLUMN result_value TEXT;
ALTER TABLE test_requests ADD COLUMN lab_notes TEXT;
ALTER TABLE test_requests ADD COLUMN completed_by INT REFERENCES lab_users(id);
ALTER TABLE test_requests ADD COLUMN completed_at TIMESTAMP;
```

### Migration 005: ربط التحاليل بالأطباء

```sql
-- إضافة عمود الطبيب لطلبات التحاليل
ALTER TABLE test_requests ADD COLUMN doctor_id INT REFERENCES doctors(id);
CREATE INDEX idx_test_requests_doctor_id ON test_requests(doctor_id);
```

---

## 📱 التحميل الكسول (Lazy Loading)

يستخدم المشروع `React.lazy()` و `Suspense` لتحميل الصفحات عند الحاجة فقط:

```javascript
// src/routes/lazy.js
export const Login = lazy(() => import('../pages/Auth/Login/Login'));
export const DoctorDashboard = lazy(() => import('../pages/doctorDashbord/pages/DoctorDashbord'));
export const ReceptionAppointments = lazy(() => import('../pages/Reception/ReceptionAppointments'));
export const LabHome = lazy(() => import('../pages/LabDashboard/LabHome'));
// ... وغيرها
```

الفوائد:
- ✅ تقليل حجم الحزمة الأولية (Initial Bundle)
- ✅ تحميل أسرع للصفحة الأولى
- ✅ تحميل كل صفحة عند طلبها فقط

---

## 🧪 إدارة التحاليل المعملية

### سير العمل الكامل

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   الطبيب      │ ──→│   المعمل      │ ──→│   النتيجة     │
│              │    │              │    │              │
│ يطلب تحليل   │    │ يجري التحليل  │    │ تظهر عند     │
│ من سجل المريض │    │ ويدخل النتيجة │    │ الطبيب فوراً  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### التحاليل من جانب الطبيب (`Tests.jsx`)

- اختيار المريض من القائمة
- اختيار نوع التحليل من قائمة التحاليل المتوفرة
- إرسال الطلب → يتم إنشاء `test_request` بحالة "قيد التنفيذ"
- عرض نتائج التحاليل السابقة للمريض

### التحاليل من جانب المعمل (`LabHome.jsx` + `LabResultModal.jsx`)

- جدول بجميع الطلبات المعلقة (بحالة "قيد التنفيذ")
- بحث بالاسم أو نوع التحليل
- نافذة إدخال النتائج مع:
  - حقل النتيجة
  - ملاحظات المعمل
  - معلومات المريض والطبيب الطالب
- تحديث تلقائي عبر Realtime

---

## 💊 نظام الوصفات الطبية

### سير العمل

```
الطبيب يفتح صفحة الوصفات
    │
    ├─→ البحث عن المريض واختياره
    │
    ├─→ اختيار الأدوية من القائمة المصنفة
    │   ├─→ تحديد فئة الدواء (drug_category)
    │   ├─→ اختيار الدواء (medication)
    │   ├─→ تحديد الجرعة (dosage)
    │   └─→ تحديد المدة (duration)
    │
    ├─→ إضافة تعليمات خاصة
    │
    ├─→ حفظ الوصفة
    │   ├─→ إنشاء prescription في DB
    │   └─→ إنشاء prescription_medications
    │
    └─→ طباعة الوصفة (PrescriptionSheet.jsx)
        └─→ تصدير PDF أو طباعة مباشرة
```

### خيارات الجرعة الافتراضية

```
مرة يومياً | مرتين يومياً | كل 8 ساعات | كل 12 ساعة | حسب الحاجة | قبل الأكل | بعد الأكل
```

### خيارات المدة الافتراضية

```
يوم واحد | 3 أيام | أسبوع | 10 أيام | أسبوعين | شهر | حسب التعليمات
```

---

## 🔒 الأمان ونقاط مهمة

### حماية المسارات
- كل لوحة تحكم تتحقق من دور المستخدم قبل العرض
- أي محاولة وصول غير مصرح بها تُحوّل لصفحة 404

### قواعد البيانات
- استخدام Foreign Keys لضمان تكامل البيانات
- `ON DELETE CASCADE` لحذف البيانات المرتبطة تلقائياً
- `ON DELETE SET NULL` للحفاظ على السجلات عند حذف المرجع

### التحقق من البيانات
- استخدام **Yup** للتحقق من صحة البيانات قبل الإرسال
- استخدام **Formik** لإدارة حالة النماذج

### معالجة الأخطاء
- **Error Boundaries** في React لالتقاط أخطاء الواجهة
- **SweetAlert2** لعرض رسائل الخطأ بشكل واضح
- **Console logging** مفصل لتتبع الأخطاء

---

## 📈 نظام الإحصائيات

متوفر في لوحة تحكم الطبيب والاستقبال:

### إحصائيات الاستقبال:

| الإحصائية | الوصف |
|-----------|-------|
| مواعيد اليوم | عدد المواعيد لليوم الحالي |
| مواعيد الأسبوع | إجمالي مواعيد الأسبوع |
| مواعيد الشهر | إجمالي مواعيد الشهر |
| الرسم البياني الخطي | مواعيد آخر 7 أيام (كلي / مكتمل / معلق) |
| التوزيع حسب النوع | كشف / متابعة / استشارة (مع حالة الدفع) |
| التوزيع حسب الطبيب | عدد المواعيد لكل طبيب |
| حالة الدفع | مدفوع / غير مدفوع |

### إحصائيات الطبيب:

| الإحصائية | الوصف |
|-----------|-------|
| المرضى الشهريين | رسم بياني خطي |
| أنواع الزيارات | رسم دائري |
| الإيرادات | رسم بياني + ملخص |
| أكثر الأدوية وصفاً | رسم بياني أعمدة |
| إحصائيات سريعة | كروت ملخصة |

---

## 🔄 دورة حياة التطبيق

```
App.jsx يبدأ
    │
    ├─→ fetchData() - جلب جميع البيانات الأولية
    │   (appointments, patients, doctors, tests, ...)
    │
    ├─→ setupRealtimePatients() - بدء الاستماع للتحديثات اللحظية
    │
    ├─→ BrowserRouter + RoutesPages - تحميل المسارات
    │
    ├─→ ToastContainer - تهيئة الإشعارات
    │
    └─→ عند الخروج: removeRealtimeChannel() - تنظيف
```

---

## 🛑 معالجة الأخطاء (Error Handling)

### Error Boundary
يُستخدم في لوحة تحكم الطبيب لالتقاط أخطاء React:

```javascript
class ErrorBoundary extends Component {
  // يعرض رسالة خطأ مفصلة بدلاً من شاشة بيضاء
  // يشمل: رسالة الخطأ + Component Stack Trace
}
```

### نمط معالجة الأخطاء العام

```javascript
try {
  // العملية
  const { data, error } = await supabase.from('table').select();
  if (error) throw error;
  // نجاح → SweetAlert نجاح
} catch (err) {
  // فشل → SweetAlert خطأ + Console Error
  console.error('تفاصيل الخطأ:', { message, details, hint, code });
  Swal.fire({ icon: 'error', title: 'خطأ', text: 'وصف الخطأ' });
}
```

---

## 📝 ملاحظات تطويرية مهمة

### 1. منع الكشف المزدوج
```
لا يمكن بدء كشف جديد إذا كان هناك مريض في الكشف حالياً.
يجب إنهاء أو إلغاء الكشف الحالي أولاً.
```

### 2. منع تكرار المرضى
```
عند إضافة مريض جديد، يتم التحقق من رقم الهاتف.
إذا كان الرقم موجوداً → يُستخدم المريض الحالي بدلاً من إنشاء سجل جديد.
```

### 3. إزالة التكرارات
```javascript
// دالة removeDuplicates تُستخدم في كل مكان لمنع تكرار البيانات
const removeDuplicates = (data, key = 'id') => {
  const seen = new Set();
  return data.filter(item => {
    const duplicate = seen.has(item[key]);
    seen.add(item[key]);
    return !duplicate;
  });
};
```

### 4. التحميل الذكي
```
fetchData() تتحقق أولاً هل البيانات محمّلة مسبقاً
إذا كانت محمّلة → لا تعيد الجلب (تجنب الطلبات الزائدة)
```

---

## 📞 الدعم والتواصل

- **الموقع**: [Smart Clinic](https://health-project-mu.vercel.app/)
- **البريد لاستعادة كلمة المرور**: يُرسل رابط إلى `health-project-mu.vercel.app/resetpassword`
- **الاسم التقني للمشروع**: `smart-clinic`
- **الإصدار**: `0.0.0`

---

> 📌 **تم إعداد هذا التوثيق بشكل شامل ليغطي كافة جوانب نظام العيادة الذكية. يُرجى تحديثه عند إضافة ميزات جديدة أو تعديل الهيكل.**

</div>
