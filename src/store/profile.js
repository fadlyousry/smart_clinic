import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supaBase/booking';

export const useProfileStore = create(
  persist(
    set => ({
      doctorProfile: {},
      changedProfileData: {},
      setChnagedProfileData: dt => {
        set({ changedProfileData: dt });
      },
      updateProfileData: async dt => {
        const { data, error } = await supabase.from('doctors').update(dt).eq('id', 1).select();
        if (error) {
          console.error('Update failed:', error.message);
        } else {
          set({ doctorProfile: data });
          console.log('after Change', data);
        }
      },

      getDoctorProfile: async () => {
        const { data, error } = await supabase.from('doctors').select('*').single();

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
