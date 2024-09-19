import { useContext, useState } from 'react';
import { ModalContext } from '../../components/Modal';
// import { useVerifyOtp } from './OtpAuth';
import { VerifyOtpApi } from '../../services/AdminApi';
import { useAlert } from '../../hooks/useAlert';

interface Props {
  email: string;
  fetchData: () => void; // Add fetchData prop
}

export default function VerifyModal({ email, fetchData }: Props) {
  const { closeModal } = useContext(ModalContext);
  const [otp, setOtp] = useState('');
  const { showSuccessToast } = useAlert();
  const [error, setError] = useState<string | null>(null); // State for error message

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Verify OTP
      const res = await VerifyOtpApi(email, otp);

      console.log(res, 'res--');
      if (res.success) {
        showSuccessToast(res.message);
        fetchData();
      }
      // Refetch data after OTP verification

      // Close the modal
      closeModal();
    } catch (error) {
      setError('Invalid OTP. Please try again.'); // Set error message

      console.error('Error:', error);
    }
  }

  return (
    <div className="flex justify-center w-96 dark:bg-boxdark">
      <div className="relative bg-white w-96 rounded-lg shadow dark:bg-gray-700 dark:bg-boxdark">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Enter The OTP
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Enter OTP Sent to Email
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter the 4 digit OTP"
                required
              />
              <p className="text-red-500 text-xs " style={{ marginTop: 10 }}>
                {error}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Enter OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
