import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../../components/Modal';
import AddUser from './AddUser';
import { useEffect, useState } from 'react';
import { deleteUser, fetchVerifiedUsers } from '../../services/AdminApi';
import type { AddDoctor, AdReceptionist } from '../../types/package';
import { useAlert } from '../../hooks/useAlert';

export interface UserData {
  _id: string;
  username: string;
  email: string;
  mobileNumber: string;
  role: string;
  isVerified: boolean;
}

export default function AddDoctor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<UserData[]>([]);
  const { showConfirmAlert } = useAlert();
  const fetchData = async () => {
    const result = await fetchVerifiedUsers(searchQuery);
    if (result) {
      // Combine doctors and receptionists into one list
      const combinedData = [
        ...result.doctors.map((doctor: AddDoctor) => ({
          ...doctor,
          role: 'Doctor',
        })),
        ...result.receptionists.map((receptionist: AdReceptionist) => ({
          ...receptionist,
          role: 'Receptionist',
        })),
      ];
      setData(combinedData);
      console.log(combinedData, 'combinedData');
    }
  };
  useEffect(() => {
    // Fetch data when component mounts or when searchQuery changes

    fetchData();
  }, [searchQuery]);
  async function handleDelete(id: string) {
    const res = await showConfirmAlert(
      'Delete User',
      'Are you Sure you want to delete the user',
    );
    if (res.isConfirmed) {
      await deleteUser(id);
      fetchData();
    }
  }

  return (
    <>
      {/* <h1>Add Doctor</h1> */}

      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-boxdark dark:border-gray-700">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              Manage users
            </h1>
          </div>
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
              <form className="lg:pr-3" action="#" method="GET">
                <label htmlFor="users-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="users-search"
                    className="bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:border-primary-500 block w-full p-2.5 dark:text-white"
                    placeholder="Search for users"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
              <Modal>
                <Modal.Open opens="crud-modal">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    style={{ background: '#4686e5' }}
                  >
                    <svg
                      className="w-5 h-5 mr-2 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    Add user
                  </button>
                </Modal.Open>
                <Modal.Window name="crud-modal">
                  <div className="flex justify-center">
                    <AddUser mode="create" fetch={fetchData} />
                  </div>
                </Modal.Window>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:bg-boxdark">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-boxdark">
                  {data.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap">
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {user.username}
                          </div>
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.role}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.mobileNumber}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center">
                          <div
                            className="h-2.5 w-2.5 rounded-full mr-2
                                  bg-green-400
                                   
                                "
                          ></div>
                          {'Verified'}
                        </div>
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <Modal>
                          <Modal.Open opens="edit-user">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                              style={{ background: '#4686e5' }}
                            >
                              <FaEdit className="w-3.5 h-3.5 mr-2" />{' '}
                              {/* Using FaEdit icon */}
                              Edit user
                            </button>
                          </Modal.Open>
                          <Modal.Window name="edit-user">
                            <div className="flex justify-center">
                              <AddUser
                                user={user}
                                mode={'edit'}
                                fetch={fetchData}
                              />
                            </div>
                          </Modal.Window>

                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                            onClick={() => handleDelete(user._id)}
                          >
                            <FaTrash className="w-3.5 h-3.5 mr-2" />{' '}
                            {/* Using FaTrash icon */}
                            Delete user
                          </button>
                        </Modal>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
