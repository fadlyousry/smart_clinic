import { useFormikContext } from 'formik';
import useAuthStore from '../../../store/auth';

export function SubmitButton() {
  const { setFieldValue } = useFormikContext();
  const { CUphone, CUaddress, CUname } = useAuthStore();

  return (
    <div className="mt-8 flex justify-center ">
      <button
        type="submit"
        style={{ backgroundColor: '#0097A7', margin: '8px' }}
        className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        احجز الموعد
      </button>

      {CUname() && (
        <button
          onClick={() => {
            setFieldValue('fullName', CUname());
            setFieldValue('address', CUaddress());
            setFieldValue('age', 32);
            setFieldValue('phoneNumber', CUphone());
          }}
          style={{ backgroundColor: '#00a788ff', margin: '8px' }}
          className="px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          ملئ تلقائى
        </button>
      )}
    </div>
  );
}
