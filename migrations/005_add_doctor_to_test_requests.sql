-- إضافة عمود doctor_id لجدول test_requests لربط التحليل بالطبيب
ALTER TABLE public.test_requests
ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES public.doctors(id) ON DELETE SET NULL;

-- إنشاء Index لتحسين سرعة الجلب
CREATE INDEX IF NOT EXISTS idx_test_requests_doctor_id ON public.test_requests(doctor_id);
