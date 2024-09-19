import { useEffect, useState } from 'react';
import { useUser } from '../Authentication/useUser';
import { useAlert } from '../../hooks/useAlert';
import { getAppoitmentForPatient } from '../../services/PatientApi';

export default function ViewBookedAppoitment() {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { showErrorToast, showSuccessToast } = useAlert();
  console.log(users, 'users');

  async function fetchUsers() {
    try {
      const res = await getAppoitmentForPatient(currentDate);
      console.log(res, 'response');
      setUsers(res.data);
      if (res.statusCode === 200) {
        showSuccessToast(' Appoitment Fetched Successfully');
      }
    } catch (error: any) {
      showErrorToast(error.message);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, [user, currentDate]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);
  return (
    <>
      {/* <h1>Add Doctor</h1> */}

      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-boxdark dark:border-gray-700">
        <div className="w-full mb-5">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              View Shedule
            </h1>
          </div>

          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0">
              <form className="lg:pr-3" action="#" method="GET">
                <label htmlFor="date-select" className="sr-only">
                  Select Date
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="date"
                    name="date"
                    id="date-select"
                    className="bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-primary-500 block w-full p-2.5 dark:text-white"
                    placeholder="Select a date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                  />
                </div>
              </form>
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
                      Code
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Slot Time
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Peoples For Slot
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Specialist
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
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.patientToken}
                      </td>
                      <td className="flex items-center p-4 mr-1 space-x-6 whitespace-nowrap">
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {user.doctorId.username}
                          </div>
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {user.doctorId.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.time}
                      </td>
                      <td className="p-6 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.slotId.peoples}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.doctorId.specialist}
                      </td>
                      <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full mr-2 ${
                              user.isDeleted ? 'bg-red-400' : 'bg-green-400'
                            }`}
                          ></div>
                          {user.isDeleted ? (
                            <span className="text-red-500">Canceled</span>
                          ) : (
                            <span className="text-green-500">Booked</span>
                          )}
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
