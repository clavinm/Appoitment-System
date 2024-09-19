// import { useAlert } from '../../hooks/useAlert';
import { useEffect, useState } from 'react';
import Filter from '../../components/Filter';
import { getAllUsers } from '../../services/AdminApi';
import { UserData } from './AddDoctor';
import { AddDoctor, AdReceptionist } from '../../types/package';
import { useSearchParams } from 'react-router-dom';

export default function ViewUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<UserData[]>([]);
  const [searchParams] = useSearchParams();

  console.log(searchParams.get('status'), 'searchParams');

  console.log(searchParams.get('status'), 'searchParams');

  const fetchData = async () => {
    const result = await getAllUsers(
      searchQuery,
      searchParams.get('status') || 'all',
    );
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
  }, [searchQuery, searchParams.get('status')]);

  return (
    <>
      {/* <h1>Add Doctor</h1> */}

      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-boxdark dark:border-gray-700">
        <div className="w-full mb-5">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              View users
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
              <Filter
                filterField="status"
                options={[
                  { value: '', label: 'All' },
                  { value: 'Doctor', label: 'Doctor' },
                  { value: 'Receptionist', label: 'Receptionist' },
                ]}
              />
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
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-boxdark">
                  {data.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="flex items-center p-4 mr-1 space-x-6 whitespace-nowrap">
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
                            className={`h-2.5 w-2.5 rounded-full mr-2 ${
                              user.isVerified === true
                                ? 'bg-green-400'
                                : 'bg-red-500'
                            }`}
                          ></div>
                          {user.isVerified === true ? 'Verified' : 'Unverified'}
                        </div>
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
