import { useState } from 'react';
import { createSlots } from '../../services/DoctorApi';
import { useAlert } from '../../hooks/useAlert';
// import { toast } from 'react-toastify';

export default function SlotForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const { showErrorToast, showSuccessToast } = useAlert();
  const [selectedSlots, setSelectedSlots] = useState<
    { time: string; slotNo: number }[]
  >([]);

  const slots = [
    { time: '9:00 AM - 10:00 AM', slotNo: 1 },
    { time: '10:00 AM - 11:00 AM', slotNo: 2 },
    { time: '11:00 AM - 12:00 PM', slotNo: 3 },
    { time: '2:00 PM - 3:00 PM', slotNo: 4 },
    { time: '3:00 PM - 4:00 PM', slotNo: 5 },
    { time: '4:00 PM - 5:00 PM', slotNo: 6 },
    { time: '5:00 PM - 6:00 PM', slotNo: 7 },
    { time: '6:00 PM - 7:00 PM', slotNo: 8 },
  ];

  const handleSlotChange = (slot: { time: string; slotNo: number }) => {
    if (selectedSlots.find((s) => s.slotNo === slot.slotNo)) {
      setSelectedSlots(selectedSlots.filter((s) => s.slotNo !== slot.slotNo));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDate) {
      showErrorToast('Please select a date');
      return;
    }

    const slotsData = {
      date: selectedDate,
      slots: slots.map((slot) => ({
        time: slot.time,
        slotNo: slot.slotNo,
        isAvailable: selectedSlots.some((s) => s.slotNo === slot.slotNo),
      })),
    };

    try {
      const result = await createSlots(slotsData);
      console.log(result);
      showSuccessToast('Slots created successfully');
      setSelectedDate('');
      setSelectedSlots([]);
    } catch (error: any) {
      console.error('Error creating slots:', error);
      showErrorToast(error.message || 'Failed to create slots');
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Set Availability Slots
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="datePicker"
              className="block text-sm font-medium text-gray-700"
            >
              Select Date:
            </label>
            <input
              type="date"
              id="datePicker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min={new Date().toISOString().split('T')[0]}
              max={
                new Date(new Date().setDate(new Date().getDate() + 7))
                  .toISOString()
                  .split('T')[0]
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center"
              >
                <input
                  type="checkbox"
                  id={`slot-${index}`}
                  checked={selectedSlots.some((s) => s.slotNo === slot.slotNo)}
                  onChange={() => handleSlotChange(slot)}
                  className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <label
                  htmlFor={`slot-${index}`}
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  {slot.time}{' '}
                  {selectedSlots.some((s) => s.slotNo === slot.slotNo)
                    ? '(Enabled)'
                    : '(Disabled)'}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setSelectedSlots(slots)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-sm"
            >
              Select All
            </button>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
