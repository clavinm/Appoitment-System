import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  chatUpload,
  getChatsByPatientAndDoctor,
  getPatientsDoctorChat,
} from '../services/DoctorApi';
import { useUser } from '../features/Authentication/useUser';
import { useAlert } from '../hooks/useAlert';

const Notes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');
  const { user } = useUser();
  const { showErrorToast } = useAlert();
  console.log(notes, 'selectedPatient');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  async function fetchData() {
    const filteredPatients = await getPatientsDoctorChat(searchTerm);
    setData(filteredPatients.data);
    console.log(data, 'data');
  }
  async function fetchChat() {
    try {
      const res = await getChatsByPatientAndDoctor({
        patientId: selectedPatient?._id,
        date: filterDate,
      });
      setNotes(res.data);
      console.log(res, 'res');
    } catch (e: any) {
      showErrorToast(e.message);
      console.log(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user, searchTerm]);

  useEffect(() => {
    if (selectedPatient) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      fetchChat();
    }
  }, [selectedPatient, filterDate]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);
  const handleNoteClick = (patient: any) => {
    setSelectedPatient(patient);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== '') {
      try {
        const result = await chatUpload({
          patientId: selectedPatient?._id,
          message,
        });
        console.log(result, 'result');
        setMessage('');
        fetchChat();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file, 'file');
      try {
        const result = await chatUpload({
          patientId: selectedPatient?._id,
          file,
        });
        console.log(result, 'result');
        setMessage('');
        fetchChat();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className="flex flex-col p-6 w-full bg-white dark:bg-boxdark">
      {!selectedPatient ? (
        <>
          <div className="flex flex-row items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search by Patient ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 text-gray-900 w-50 sm:text-sm rounded-lg focus:border-primary-500 p-2.5 dark:text-white"
            />
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
                          Patient ID
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
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
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-boxdark">
                      {data.map((patient) => (
                        <tr
                          key={patient._id}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {patient.code}
                          </td>
                          <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {patient.username}
                          </td>
                          <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {patient.mobileNumber}
                          </td>
                          <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <button
                              onClick={() => handleNoteClick(patient)}
                              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl"
                            >
                              Note
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
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notes for {selectedPatient.username}
            </h2>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 text-gray-900 w-50 sm:text-sm rounded-lg focus:border-primary-500 p-2.5 dark:text-white"
            />
            <button
              onClick={() => setSelectedPatient(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
            >
              Back to Patient List
            </button>
          </div>

          <div className="flex flex-col flex-grow h-full">
            <div className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col space-y-2">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      note.type === 'text'
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-blue-200 dark:bg-blue-700'
                    }`}
                  >
                    {note.type === 'text'
                      ? note.message
                      : note.type === 'file' && (
                          <>
                            <img
                              src={note.message}
                              alt={note.message}
                              className="max-w-xs"
                            />

                            <p>File: {note.filename}</p>
                            <a
                              href={note.message}
                              download={note.message}
                              className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                            >
                              View File
                            </a>
                          </>
                        )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-200 dark:bg-gray-900 p-4 border-t border-gray-300 dark:border-gray-700 backdrop-filter backdrop-blur-lg">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-grow border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-primary-500 p-2.5 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                  Send
                </button>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer"
                >
                  Upload File
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
