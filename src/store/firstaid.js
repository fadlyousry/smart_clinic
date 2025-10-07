import { create } from 'zustand';
import { supabase } from '../supaBase/booking';
import { persist } from 'zustand/middleware';

const useFirstAidStore = create(
  persist(
    (set, get) => ({
      lastId: 0,

      getStateById: async () => {
        const { data, error } = await supabase.from('FirstAid').select('*').eq('key', get().lastId).single();

        if (error) {
          console.error('Error fetching FirstAid record:', error.message);
          return null;
        }

        // set({ lastId: id });
        return data;
      },

      getAllStatusNames: async () => {
        const { data, error } = await supabase.from('FirstAid').select('name,key');
        console.log(data);

        if (error) {
          console.error('Error fetching FirstAid names:', error.message);
          return [];
        }

        return data;
      },
      setLastId: id => {
        set({ lastId: id });
      },
    }),
    {
      name: 'firstaid-key',
      partialize: state => ({ lastId: state.lastId }),
    }
  )
);

export default useFirstAidStore;
