import { create } from 'zustand';

const usePatientStore = create((set) => ({
  selectedPatientName: '',
  setSelectedPatientName: (name) => set({ selectedPatientName: name }),
}));

export default usePatientStore;
