import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Loader from './common/Loader';
import Dashboard from './pages/Dashboard';
import AccessControlRoute from './components/AccessControlRoutes';
import { ROLES } from './constants';
import Notes from './pages/Notes';
import PageNotFound from './components/PageNotFound';
import PageTitle from './components/PageTitle';
import Login from './features/Authentication/Login';
import DefaultLayout from './layout/DefaultLayout';
import ForgotPassword from './features/Authentication/ForgotPassword';
import ResetPassword from './features/Authentication/ResetPassword';
import AlertContextProvider from './components/Toast';
import AddUserLayout from './pages/AddUserLayout';
import VerifyUsers from './features/Admin/VerifyUsers';
import ViewUsers from './features/Admin/ViewUsers';
import Profile from './features/Admin/Profile';
import DoctorProfile from './features/Doctor/DoctorProfile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Hello from './features/Authentication/hello';
import ProtectedRoute from './components/ProtectedRoute';
import ViewShedule from './features/Doctor/ViewShedule';
import CreateSlot from './features/Doctor/CreateSlot';
import CreateAppoitment from './features/Receptionist/CreateAppoitment';
import CreatePatient from './features/Receptionist/CreatePatient';
import ViewPatients from './features/Receptionist/ViewPatients';
import RecepProfile from './features/Receptionist/RecepProfile';
import AssignPatient from './features/Receptionist/AssignPatient';
import ViewBookedAppoitment from './features/Patient/ViewBookedAppoitment';
import FeedBack from './features/Patient/FeedBack';
import PatientProfile from './features/Patient/PatientProfile';
// import ViewPatients from './features/Doctor/ViewPatients';
// import MentorChat from './features/Admin/Chat';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The time till the next re-fetch happens
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <PageTitle />
        <AlertContextProvider>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <DefaultLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                element={<AccessControlRoute allowedRoles={[ROLES.ADMIN]} />}
              >
                <Route path="/addUsers" element={<AddUserLayout />} />
                <Route path="/verifyUsers" element={<VerifyUsers />} />
                <Route path="/viewUsers" element={<ViewUsers />} />
                <Route path="/adminProfile" element={<Profile />} />
              </Route>
              <Route
                element={<AccessControlRoute allowedRoles={[ROLES.DOCTOR]} />}
              >
                <Route path="notes" element={<Notes />} />
                <Route path="doctorProfile" element={<DoctorProfile />} />
                <Route path="createSlot" element={<CreateSlot />} />
                <Route path="viewShedule" element={<ViewShedule />} />
              </Route>
              <Route
                element={
                  <AccessControlRoute allowedRoles={[ROLES.RECEPTIONIST]} />
                }
              >
                <Route path="createAppoitment" element={<CreateAppoitment />} />
                <Route path="createPatient" element={<CreatePatient />} />
                <Route path="viewPatient" element={<ViewPatients />} />
                <Route path="receptionistProfile" element={<RecepProfile />} />
                <Route path="/assign-patient/:id" element={<AssignPatient />} />
                {/* <Route path="assign-patient" element={<AssignPatient />} /> */}
              </Route>
              <Route
                element={<AccessControlRoute allowedRoles={[ROLES.USER]} />}
              >
                <Route path="viewAppoitment" element={<ViewBookedAppoitment />} />
                <Route path="patientReview" element={<FeedBack />} />
                <Route path="patientProfile" element={<PatientProfile />} />
              </Route>
            </Route>
            <Route path="hello" element={<Hello />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="resetPassword" element={<ResetPassword />} />
          </Routes>
        </AlertContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
