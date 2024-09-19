import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../components/Modal';
import { useAlert } from '../../hooks/useAlert';
import { useAddDoctor } from './useAddDoctor';
import { useAddReceptionist } from './useAddReceptionist';
import {
  editUser,
  getUnassingnedDoctor,
} from '../../services/AdminApi';

interface User {
  user: any;
  mode: string;
  fetch: () => void;
}
export default function AddUser({ user, mode, fetch }: User) {
  const { closeModal } = useContext(ModalContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  // const [position, setPosition] = useState('');
  const [address, setAddress] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [dob, setDob] = useState<Date>(new Date());
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [unassignedDoctors, setUnassignedDoctors] = useState([]);
  const [doctor, setDoctor] = useState('');
  const { addDoctor, isLoading } = useAddDoctor();
  const { addReceptionist } = useAddReceptionist();
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const { showConfirmAlert, showSuccessToast } = useAlert();
  console.log(selectedDoctors);
  useEffect(() => {
    async function fetchData() {
      const unassignedDoctors = await getUnassingnedDoctor();
      // console.log(unassignedDoctors.data);
      setUnassignedDoctors(unassignedDoctors.data);

      if (mode === 'edit' && user) {
        setName(user.username);
        setEmail(user.email);
        setPhone(user.mobileNumber);
        setRole(user.role);
        setGender(user.gender);
        setAddress(user.address);
        setDob(new Date(user.dob));
        setSpecialist(user.specialist);

        // fetch();
      }
    }
    fetchData();
  }, [mode, user]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setSelectedDoctors((prevSelectedDoctors) => {
      if (checked) {
        // Add the doctor ID to the array
        return [...prevSelectedDoctors, value];
      } else {
        // Remove the doctor ID from the array
        return prevSelectedDoctors.filter((doctorId) => doctorId !== value);
      }
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === 'edit') {
      if (role === 'Doctor') {
        const res = await editUser(user._id, {
          username: name,
          email,
          specialist,
          dob,
          gender,
          mobileNumber: phone,
          address,
        });
        if (res?.data.success) {
          showSuccessToast('Doctor updated Successfully');
          fetch();
        }
      } else if (role === 'Receptionist') {
        const res = await editUser(user._id, {
          username: name,
          email,
          dob,
          gender,
          mobileNumber: phone,
          address,
        });
        // console.log('rrevkd');

        if (res?.data.success) {
          showSuccessToast('Receptionist updated Successfully');
          fetch();
        }
      }
      // Handle edit user logic
    } else if (mode === 'create') {
      if (role === 'Doctor') {
        const res = addDoctor({
          username: name,
          email,
          specialist,
          dob,
          gender,
          mobileNumber: phone,
          address,
          password,
        });
        console.log(isLoading);

        console.log(res);
      } else if (role === 'Receptionist') {
        const res = addReceptionist({
          username: name,
          email,
          dob,
          gender,
          mobileNumber: phone,
          address,
          password,
          doctor: selectedDoctors,
        });
        setSelectedDoctors([]);
        console.log(isLoading);

        console.log(res);
      } else {
        console.log('error');
      }
    }
    // Handle create user logic

    closeModal();
  }
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

            <div
              className={`col-span-2 ${
                mode === 'edit' && role === 'Receptionist'
                  ? ''
                  : 'sm:col-span-1'
              }`}
            >
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
            {mode != 'edit' && (
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select role</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>
            )}
            {role === 'Doctor' && (
              <div
                className={`col-span-2 ${
                  mode === 'edit' ? 'sm:col-span-1' : ''
                }`}
              >
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Specialist
                </label>
                <input
                  type="text"
                  name="specialist"
                  id="specialist"
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Specialist"
                  required
                />
              </div>
            )}
            {role === 'Receptionist' && mode != 'edit' && (
              <div
                className={`col-span-2 ${
                  mode === 'edit' ? 'sm:col-span-1' : ''
                }`}
              >
                <label
                  htmlFor="doctor"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Assign Doctor
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-full text-left dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    Select doctors
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full dark:bg-boxdark dark:border-gray-500">
                      {unassignedDoctors.map(
                        (doc: { _id: string; username: string }) => (
                          <div key={doc._id} className="flex items-center p-2">
                            <input
                              type="checkbox"
                              id={doc._id}
                              value={doc._id}
                              onChange={handleCheckboxChange}
                              className="mr-2"
                            />
                            <label
                              htmlFor={doc._id}
                              className="text-gray-900 dark:text-white"
                            >
                              {doc.username}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
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
                rows={1}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border dark:bg-boxdark focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write Address here"
              ></textarea>
            </div>
            {mode != 'edit' && (
              <div className="col-span-2">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Set Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Password"
                  required
                />
              </div>
            )}
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
AddUser.defaultProps = {
  user: null,
};
