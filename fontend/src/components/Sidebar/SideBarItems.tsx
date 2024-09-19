import { ROLES } from '../../constants';
import { RxDashboard } from 'react-icons/rx';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { LiaUserSolid, LiaUserCheckSolid } from 'react-icons/lia';
import { PiUsersThree } from 'react-icons/pi';
export const dashboardItems = [
  {
    role: ROLES.ADMIN,
    links: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <RxDashboard />,
      },
      {
        title: 'Add Users',
        path: '/addUsers',
        icon: <IoIosAddCircleOutline />,
      },
      {
        title: 'Verify Users',
        path: '/verifyUsers',
        icon: <LiaUserCheckSolid />,
      },
      {
        title: 'View Users',
        path: '/viewUsers',

        icon: <PiUsersThree />,
      },
      {
        title: 'Profile',
        path: '/adminProfile',
        icon: <LiaUserSolid />,
      },
    ],
  },
  {
    role: ROLES.DOCTOR,
    links: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <RxDashboard />,
      },
      {
        title: 'Create Slots',
        path: '/createSlot',
        icon: <IoIosAddCircleOutline />,
      },
      {
        title: 'View Shedule',
        path: '/viewShedule',
        icon: <IoIosAddCircleOutline />,
      },
      {
        title: 'Take Notes',
        path: '/notes',
        icon: <LiaUserCheckSolid />,
      },

      {
        title: 'Profile',
        path: '/doctorProfile',
        icon: <LiaUserSolid />,
      },
    ],
  },
  {
    role: ROLES.RECEPTIONIST,
    links: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <RxDashboard />,
      },
      {
        title: 'Create Appoitment',
        path: '/createAppoitment',
        icon: <IoIosAddCircleOutline />,
      },
      {
        title: 'Manage Patients',
        path: '/createPatient',
        icon: <IoIosAddCircleOutline />,
      },
      {
        title: 'View Patients',
        path: '/viewPatient',
        icon: <LiaUserCheckSolid />,
      },

      {
        title: 'Profile',
        path: '/receptionistProfile',
        icon: <LiaUserSolid />,
      },
    ],
  },
  {
    role: ROLES.USER,
    links: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <RxDashboard />,
      },
      {
        title: 'View Appoitment',
        path: '/viewAppoitment',
        icon: <IoIosAddCircleOutline />,
      },

      {
        title: 'Profile',
        path: '/patientProfile',
        icon: <LiaUserSolid />,
      },
    ],
  },
];
