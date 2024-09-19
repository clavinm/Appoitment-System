import React, { useEffect } from 'react';
import CardDataStats from '../components/CardDataStats';
import { useUser } from '../features/Authentication/useUser';
import {
  getPatientsDoctorChat,
  getReceptionistById,
} from '../services/DoctorApi';
import { useNavigate } from 'react-router-dom';
import { fetchAllPatients } from '../services/ReceptionistApi';
import { getTotalAppointmentsByPatientId } from '../services/PatientApi';
import { getAllUsers } from '../services/AdminApi';
import { set } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [assigned, setAssigned] = React.useState(0);
  const [receptionist, setReceptionist] = React.useState('');
  const [patients, setPatients] = React.useState(0);
  const [doctors, setDoctors] = React.useState(0);
  const [appointments, setAppointments] = React.useState(0);
  const [canceled, setCanceled] = React.useState(0);
  const [adminUsers, setAdminUsers] = React.useState(0);
  const [adminReceptionists, setAdminReceptionists] = React.useState(0);
  const [verfied, setVerified] = React.useState(0);
  const [verifiedRep, setVerifiedRep] = React.useState(0);
  const navigate = useNavigate();
  // console.log(canceled, 'canceled');
  // console.log(appointments, 'appointments');

  useEffect(() => {
    async function fetch() {
      if (user?.role === 'receptionist') {
        const resData = await fetchAllPatients();
        setPatients(resData.data.length);
        setDoctors(user?.doctor.length);
      } else if (user?.role === 'doctor') {
        const response = await getPatientsDoctorChat();
        const res = await getReceptionistById();
        setReceptionist(res.username);
        setAssigned(response.data.length);
      } else if (user?.role === 'patient') {
        const res = await getTotalAppointmentsByPatientId();
        setCanceled(res.data.totalDeletedAppointments);
        setAppointments(res.data.totalNotDeletedAppointments);
      } else if (user?.role === 'admin') {
        const res = await getAllUsers();
        setAdminUsers(res?.doctors.length);
        setAdminReceptionists(res?.receptionists.length);
        setVerified(res?.doctors.filter((doctor:any) => doctor.isVerified).length);
        setVerifiedRep(
          res?.receptionists.filter((receptionist:any) => receptionist.isVerified)
            .length,
        );
      }
    }
    fetch();
  }, []);
  return (
    <>
      <div className="grid grid-co  ls-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {user?.role === 'admin' && (
          <>
            <CardDataStats
              title=""
              total={'Total number of Receptionists'}
              isAvailable={true}
            >
              <p className="text-red-600">Receptionist: {adminReceptionists}</p>
            </CardDataStats>

            <CardDataStats
              title=""
              total={'Total number of Doctors'}
              isAvailable={true}
            >
              <p className="text-red-600">Doctors: {adminUsers}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Total Verified Receptionists'}
              isAvailable={true}
            >
              <p className="text-red-600">Receptionist: {verifiedRep}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Total Verified Doctors'}
              isAvailable={true}
            >
              <p className="text-red-600">Doctor: {verfied}</p>
            </CardDataStats>
          </>
        )}
        {user?.role === 'receptionist' && (
          <>
            <CardDataStats title="" total={'Total Patients'} isAvailable={true}>
              <p className="text-red-600">Patients: {patients}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Assigned Doctors'}
              isAvailable={true}
            >
              <p className="text-red-600">Doctors: {doctors}</p>
            </CardDataStats>
            <div
              onClick={() => navigate('/receptionistProfile')}
              style={{ cursor: 'pointer' }}
            >
              <CardDataStats
                title=""
                total={'Reset Password'}
                isAvailable={true}
              >
                <p className="text-red-600">You Can Also Reset Your Password</p>
              </CardDataStats>
            </div>
          </>
        )}
        {user?.role === 'doctor' && (
          <>
            <CardDataStats
              title=""
              total={'Receptionist Name'}
              isAvailable={true}
            >
              <p className="text-red-600">Name: {receptionist}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Total Assigned Patients'}
              isAvailable={true}
            >
              <p className="text-red-600">Patients: {assigned}</p>
            </CardDataStats>
            {/* <CardDataStats title="" total={'hello'} isAvailable={true}>
            <p className="text-red-600">Patient In Slot: {'peoples'}</p>
          </CardDataStats> */}
            <div
              onClick={() => navigate('/doctorProfile')}
              style={{ cursor: 'pointer' }}
            >
              <CardDataStats
                title=""
                total={'Reset Password'}
                isAvailable={true}
              >
                <p className="text-red-600">You Can Also Reset Your Password</p>
              </CardDataStats>
            </div>
          </>
        )}
        {user?.role === 'patient' && (
          <>
            <CardDataStats
              title=""
              total={'Receptionist Name'}
              isAvailable={true}
            >
              <p className="text-red-600">Name: {'clav'}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Total Booked Appoitments'}
              isAvailable={true}
            >
              <p className="text-red-600">Appointment: {appointments}</p>
            </CardDataStats>
            <CardDataStats
              title=""
              total={'Total Canceled Appointments'}
              isAvailable={true}
            >
              <p className="text-red-600">Appointment: {canceled}</p>
            </CardDataStats>
            <div
              onClick={() => navigate('/patientProfile')}
              style={{ cursor: 'pointer' }}
            >
              <CardDataStats title="" total={'View Profile'} isAvailable={true}>
                <p className="text-red-600">
                  You can also View the profile by clicking it.
                </p>
              </CardDataStats>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"></div>
    </>
  );
};

export default Dashboard;
