import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supaBase/booking';
import useAuthStore from './auth';

export const useProfileStore = create(
  persist(
    set => ({
      doctorProfile: {},
      changedProfileData: {},
      setChnagedProfileData: dt => {
        set({ changedProfileData: dt });
      },
      updateProfileData: async dt => {
        const doctorId = useAuthStore.getState().CUdoctorId();
        if (!doctorId) {
          console.error('No doctor_id found for current user');
          return;
        }
        const { data, error } = await supabase.from('doctors').update(dt).eq('id', doctorId).select();
        if (error) {
          console.error('Update failed:', error.message);
        } else {
          set({ doctorProfile: data?.[0] || data });
          console.log('after Change', data);
        }
      },

      getDoctorProfile: async () => {
        const authUid = useAuthStore.getState().CUauthUid();
        const doctorId = useAuthStore.getState().CUdoctorId();
        
        let query = supabase.from('doctors').select('*');
        
        if (authUid) {
          query = query.eq('user_id', authUid);
        } else if (doctorId) {
          query = query.eq('id', doctorId);
        }
        
        const { data, error } = await query.single();

        if (error) {
          console.error('Error fetching doctor profile:', error);
          return null;
        }
        set({ doctorProfile: data });
        return data;
      },

      getDoctorImage: async imagePath => {
        if (!imagePath) return null;

        console.log(imagePath);
        const { data, error } = supabase.storage.from('images').getPublicUrl(imagePath);

        if (error) {
          console.error('Failed to get image URL:', error.message);
          return null;
        }
        return data.publicUrl;
      },
      updateDoctorImage: async (file, userId) => {
        if (!file || !file.name) {
          console.error('No file provided');
          return;
        }

        const fileExt = file.name.split('.').pop();
        const filePath = `profile_images/${userId}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage.from('images').upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          return;
        }

        // Update table with file path
        const { error: updateError } = await supabase.from('doctors').update({ image: filePath }).eq('id', userId);

        if (updateError) {
          console.error(updateError);
        }

        console.log('Uploaded & saved image at:', filePath);
      },
    }),
    {
      name: 'doc_profile', // key in localStorage
      partialize: state => ({ doctorProfile: state.doctorProfile }),
    }
  )
);
