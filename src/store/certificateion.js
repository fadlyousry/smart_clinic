import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supaBase/booking';

export const useDoctorCertificatesStore = create(
  persist(
    set => ({
      allCertificates: [],
      loading: false,
      error: null,

      fetchCertificates: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.from('certificates').select('*');

          if (error) throw error;

          set({ allCertificates: data || [], loading: false });
          console.log(data);
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error fetching certificates:', error);
          return null;
        }
      },

      // Add a new certificate
      addCertificate: async certificateData => {
        set({ loading: true, error: null });
        console.log(certificateData);
        try {
          const { data, error } = await supabase.from('certificates').insert(certificateData).select().single();
          console.log(error);
          if (error) throw error;

          set(state => ({
            allCertificates: [...state.allCertificates, data],
            loading: false,
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error adding certificate:', error);
          return null;
        }
      },

      updateCertificate: async (certificateId, updates) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('certificates')
            .update(updates)
            .eq('id', certificateId)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            allCertificates: state.allCertificates.map(cert => (cert.id === certificateId ? data : cert)),
            loading: false,
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error updating certificate:', error);
          return null;
        }
      },

      // Delete a certificate
      deleteCertificate: async certificateId => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase.from('certificates').delete().eq('id', certificateId);

          if (error) throw error;

          set(state => ({
            allCertificates: state.allCertificates.filter(cert => cert.id !== certificateId),
            loading: false,
          }));
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error deleting certificate:', error);
        }
      },
    }),
    {
      name: 'certifications',
      partialize: state => ({ allCertificates: state.allCertificates }),
    }
  )
);
