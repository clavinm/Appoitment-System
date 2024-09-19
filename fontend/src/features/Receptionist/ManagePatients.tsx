import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';

// import { deleteUser } from '../../services/AdminApi';
import {
  addPatient,
  deletePatient,
  editPatient,
} from '../../services/ReceptionistApi';

interface User {
  user: any;
  mode: string;
  fetch: () => void;
}
export default function ManagePatient({ user, mode, fetch }: User) {
  const { closeModal } = useContext(ModalContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // const [role, setRole] = useState('');
  // const [position, setPosition] = useState('');
  const [address, setAddress] = useState('');
  // const [specialist, setSpecialist] = useState('');
  const [dob, setDob] = useState<Date>(new Date());
  const [gender, setGender] = useState('');
  const { showConfirmAlert, showSuccessToast } = useAlert();
  useEffect(() => {
    async function fetchData() {
      if (mode === 'edit' && user) {
        setName(user.username);
        setEmail(user.email);
        setPhone(user.mobileNumber);
        setGender(user.gender);
        setAddress(user.address);
        setDob(new Date(user.dob));

        // fetch();
      } else if (mode === 'delete' && user) {
        const res = await showConfirmAlert(
          'Delete User',
          'Are you Sure you want to delete the user',
        );
        if (res.isConfirmed) {
          await deletePatient(user._id);
          fetch();
        }
      }
    }
    fetchData();
  }, [mode, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === 'edit') {
      const res = await editPatient(user._id, {
        username: name,
        email,
        mobileNumber: phone,
        dob,
        gender,
        address,
      });
      // console.log('rrevkd');

      if (res?.data.success) {
        showSuccessToast('Patient updated Successfully');
        fetch();
      }
    } else if (mode === 'create') {
      const res = await addPatient({
        username: name,
        email,
        mobileNumber: phone,
        dob,
        gender,
        address,
      });
      // console.log(isLoading);
      if (res?.success) {
        showSuccessToast('Patient Created Successfully');
        fetch();
      }
      console.log(res);
    } else {
      console.log('error');
    }
    // Handle create user logic

    closeModal();
  }

  if (mode === 'delete') return;
  return (
    <div className="flex justify-center p-4 w-full max-w-md max-h-full dark:bg-boxdark">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 dark:bg-boxdark">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'edit' ? 'Edit User' : 'Create New User'}
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
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type User name"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type User email"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="dob"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date Of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={dob.toISOString().split('T')[0]}
                onChange={(e) => setDob(new Date(e.target.value))}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="1234567890"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="Gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Others</option>
              </select>
            </div>

            <div className="col-span-2">
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="1234567890"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border dark:bg-boxdark focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write Address here"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {mode === 'edit' ? 'Update User' : 'Add New User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
ManagePatient.defaultProps = {
  user: null,
};
