import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  appoitmentPatientDetails,
  createAppointment,
  deleteAppointment,
  slotDetailsById,
} from '../../services/ReceptionistApi';
import { useAlert } from '../../hooks/useAlert';
// import Modal from '../../components/Modal';
import { FaTrash } from 'react-icons/fa';

const SlotDetailPage: React.FC = () => {
  const { id } = useParams();
  const [time, setTime] = useState('');
  const [patientId, setPatientId] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<any[]>([]);
  const { showSuccessToast, showErrorToast } = useAlert();
  const [search, setSearch] = useState('');
  const { showConfirmAlert } = useAlert();

  const fetchData = async () => {
    if (!id) return;
    const slotId = id;

    const res = await appoitmentPatientDetails(slotId, search);
    setPatientDetails(res?.data);
  };
  useEffect(() => {
    async function fetch() {
      if (id) {
        const slotId = id;
        const res = await slotDetailsById(slotId);
        setTime(res?.time);
      }
    }
    fetch();
    fetchData();
  }, [id, search]);
  // const users = patientDetails?.data || [];

  const handleAddPatient = async () => {
    // const newPatient = dummyPatientData[patientId];

    try {
      const res = await createAppointment({
        slotId: id,
        patientToken: patientId,
      });
      if (res?.status === 200) {
        showSuccessToast('Appoitment created successfully');
        fetchData();
      }
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to create appoitment');
    }
  };

  async function handleDelete(appointmentId: string) {
    const res = await showConfirmAlert(
      'Delete Appointment',
      'Are you Sure you want to delete the Appointment',
    );
    if (res.isConfirmed) {
      await deleteAppointment(appointmentId);

      fetchData();
      showSuccessToast('Patient Appoitment successfully');
    }
  }
  // const handleDeletePatient = (id: string) => {
  //   setPatients(patients.filter((patient) => patient.id !== id));
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Slot Timings: {time}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Assign Patient</h2>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleAddPatient}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Patient
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Patients</h2>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-boxdark dark:border-gray-700">
        <div className="w-full mb-5">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              View Patients
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    id="users-search"
                    className="bg-transparent border border-gray-300 text-gray-900 sm:text-sm rounded-lg  focus:border-primary-500 block w-full p-2.5 dark:text-white"
                    placeholder="Search for patients"
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
                      Phone
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
                  {patientDetails.map((user, index) => (
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
                        {user.patientId.mobileNumber}
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                          onClick={() => handleDelete(user._id)}
                        >
                          <FaTrash className="w-3.5 h-3.5 mr-2" />{' '}
                          {/* Using FaTrash icon */}
                          Delete user
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* {patients.length > 0 ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Patient ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="text-center">
                <td className="border px-4 py-2">{patient.id}</td>
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.phoneNumber}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients added yet.</p>
      )} */}
    </div>
  );
};

export default SlotDetailPage;
