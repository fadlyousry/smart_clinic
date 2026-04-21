-- ═══════════════════════════════════════════════════════════════════
-- Migration: إعادة هيكلة تدفق المريض + دعم أكتر من دكتور
-- ═══════════════════════════════════════════════════════════════════

-- ─── الخطوة 1: إضافة عمود user_id لجدول الأطباء ──────────────────
-- ربط كل دكتور بحساب المستخدم في auth.users
ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- إنشاء Index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON public.doctors(user_id);

-- ─── الخطوة 2: تحديث حالات المواعيد ──────────────────────────────
-- تحويل الحالات القديمة للجديدة

-- المواعيد المستقبلية اللي لسه "في الإنتظار" → "محجوز"
UPDATE public.appointments 
SET status = 'محجوز' 
WHERE status = 'في الإنتظار' 
AND date::date >= CURRENT_DATE;

-- المواعيد اللي فاتت و "في الإنتظار" → "في قاعة الانتظار" (كانوا منتظرين فعلاً)
UPDATE public.appointments 
SET status = 'في قاعة الانتظار' 
WHERE status = 'في الإنتظار' 
AND date::date < CURRENT_DATE;

-- "وصل العيادة" → "في قاعة الانتظار"
UPDATE public.appointments 
SET status = 'في قاعة الانتظار' 
WHERE status = 'وصل العيادة';

-- "ملغي" (بالياء) → "ملغى" (بالألف المقصورة) للتوحيد
UPDATE public.appointments 
SET status = 'ملغى' 
WHERE status = 'ملغي';

-- 'تم' و 'ملغى' يفضلوا زي ما هم ✅

-- ═══════════════════════════════════════════════════════════════════
-- ⚠️ بعد تشغيل الـ Migration:
-- 1. روح Supabase Dashboard → Authentication → Users
-- 2. انسخ الـ UUID بتاع كل دكتور
-- 3. حدث جدول doctors:
--    UPDATE doctors SET user_id = 'UUID_HERE' WHERE id = DOCTOR_ID;
-- ═══════════════════════════════════════════════════════════════════
