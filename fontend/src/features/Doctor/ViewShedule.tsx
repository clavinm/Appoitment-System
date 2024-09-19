// import { useAlert } from '../../hooks/useAlert';
// import Filter from '../../components/Filter';
import { useEffect, useState } from 'react';
import { getPatientsForDoctor } from '../../services/DoctorApi';
import { useUser } from '../Authentication/useUser';
import { useAlert } from '../../hooks/useAlert';

export default function ViewShedule() {
  const { user } = useUser();
  const [currentDate, setCurrentDate] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { showErrorToast, showSuccessToast } = useAlert();
  console.log(users, 'users');

  async function fetchUsers() {
    const doctorId = user?._id;
    const date = currentDate;
    try {
      const res = await getPatientsForDoctor(doctorId, date);
      // console.log(res, 'response');
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Gender
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Phone
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
                            {user.patientId.username}
                          </div>
                          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            {user.patientId.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.patientId.gender}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.patientId.address}
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.patientId.mobileNumber}
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
