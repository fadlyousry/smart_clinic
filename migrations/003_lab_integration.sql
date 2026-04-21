-- ============================================
-- Migration: Lab Integration - Module 1
-- Description: إضافة جداول المعمل ومستخدمين المعمل
-- ============================================

-- إنشاء جدول مستخدمي المعمل
CREATE TABLE IF NOT EXISTS public.lab_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- إنشاء جدول طلبات المعمل
CREATE TABLE IF NOT EXISTS public.lab_requests (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES public.doctors(id) ON DELETE SET NULL,
    test_name VARCHAR(255) NOT NULL,
    doctor_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed
    result_text TEXT,
    result_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE
);
