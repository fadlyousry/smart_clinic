-- تحديث جدول طلبات التحاليل (test_requests) الحالي ليدعم نظام المعمل المتكامل

ALTER TABLE public.test_requests
ADD COLUMN IF NOT EXISTS result_value TEXT,
ADD COLUMN IF NOT EXISTS lab_notes TEXT,
ADD COLUMN IF NOT EXISTS completed_by INTEGER REFERENCES public.lab_users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
