import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supaBase/booking';

export const useExperiencesStore = create(
  persist(
    (set, get) => ({
      allExperiences: [],
      getAllExperiences: async () => {
        let { data: experiences, error } = await supabase.from('experiences').select('*');

        if (error) {
          console.log('get experiences', error);
        } else {
          set({ allExperiences: experiences });
        }
      },
      addExperience: async dt => {
        const { data, error } = await supabase.from('experiences').insert([dt]).select();

        if (error) {
          console.log('insert experiences', error);
        } else {
          console.log(data);

          set(state => ({
            allExperiences: [...state.allExperiences, data[0]],
          }));
        }
      },
      deleteExperience: async id => {
        const { error } = await supabase.from('experiences').delete().eq('id', id);

        if (error) {
          console.log('delete experiences', error);
        } else {
          get().getAllExperiences();
        }
      },
    }),
    {
      name: 'experiences',
      partialize: state => ({ allExperiences: state.allExperiences }),
    }
  )
);
