-- ============================================
-- Migration: Multi-Doctor Support
-- Description: إضافة دعم الدكاتره المتعددين
-- ============================================

-- إضافة عمود is_admin (هل الدكتور أدمن؟)
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- إضافة عمود is_active (هل الحساب نشط؟)
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- إضافة عمود التخصص
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS specialization TEXT DEFAULT '';

-- تحديد أول دكتور كأدمن
UPDATE doctors SET is_admin = true WHERE id = 1;
