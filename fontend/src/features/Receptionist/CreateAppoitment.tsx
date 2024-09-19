import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { getSlotsForDate, sendDoctors } from '../../services/ReceptionistApi';
import { useUser } from '../Authentication/useUser';
import { Link } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';

interface Slot {
  _id: string;
  time: string;
  date: string;
  doctorId: string;
  patientId?: string;
  peoples?: number;
  isAvailable: boolean;
}

const ReceptionistPage: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showSlots, setShowSlots] = useState<boolean>(false);
  const { user } = useUser();
  const [doctor, setDoctor] = useState<any[]>([]);
  const [initialSlots, setInitialSlots] = useState<Slot[]>([]);
  const { showSuccessToast, showErrorToast } = useAlert();

  useEffect(() => {
    async function fetch() {
      const res = await sendDoctors(user._id);
      setDoctor(res?.data);
    }
    // Set today's date as the default selected date
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetch();
  }, []);

  async function handleCreateAppointment() {
    if (selectedDoctor && selectedDate) {
      setShowSlots(true);
      const res = await getSlotsForDate({
        date: selectedDate,
        doctorId: selectedDoctor,
      });
      if (res?.status === 200) {
        console.log(res.data, 'hiii-------------');

        setInitialSlots(res.data);
        showSuccessToast('Slots fetched successfully');
      }
      // console.log(res, 'hiii-------------');
    } else {
      showErrorToast('Please select both a doctor and a date first!');
      // alert('Please select both a doctor and a date first!');
    }
  }

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctor(event.target.value);
    setShowSlots(false); // Reset slots view on doctor change
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setShowSlots(false); // Reset slots view on date change
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Page</h1>

      <div className="mb-4">
        <label
          htmlFor="doctorSelect"
          className="block text-gray-700 font-bold mb-2"
        >
          Select Doctor:
        </label>
        <select
          id="doctorSelect"
          value={selectedDoctor}
          onChange={handleDoctorChange}
          className="border p-2 rounded"
        >
          <option value="">Select a doctor</option>
          {doctor.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="dateFilter"
          className="block text-gray-700 font-bold mb-2"
        >
          Select Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
          onClick={handleCreateAppointment}
        >
          Show Available Slots
        </button>
      </div>
      {showSlots && initialSlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {initialSlots.map((slot, index) =>
            slot.isAvailable ? (
              <Link to={`/assign-patient/${slot._id}`}>
                <CardDataStats
                  key={index}
                  title=""
                  total={slot.time}
                  isAvailable={slot.isAvailable}
                >
                  <p className="text-red-600">
                    Patient In Slot: {slot.peoples}
                  </p>
                </CardDataStats>
              </Link>
            ) : (
              <div onClick={() => showErrorToast('This Slot Is Not Available')}>
                <CardDataStats
                  key={index}
                  title=""
                  total={slot.time}
                  isAvailable={slot.isAvailable}
                >
                  <p className="text-red-600">
                    Patient In Slot: {slot.peoples}
                  </p>
                </CardDataStats>
              </div>
            ),
          )}
        </div>
      ) : showSlots ? (
        <p className="text-red-500">
          No slots available for the selected date and doctor.
        </p>
      ) : null}
    </div>
  );
};

export default ReceptionistPage;
