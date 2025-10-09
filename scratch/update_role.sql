UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "reception"}'::jsonb 
WHERE email = 'fadlahmed258@gmail.com';
