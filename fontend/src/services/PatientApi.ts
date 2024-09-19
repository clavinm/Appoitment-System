import { jsonApiClient } from './api';

//getAppoitmentForPatient
export const getAppoitmentForPatient = async (currentDate: string) => {
  try {
    const response = await jsonApiClient.post(
      `/api/patient/getAppoitmentForPatient`,
      { currentDate },
    );
    // console.log(response.data.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
//getTotalAppointmentsByPatientId
export const getTotalAppointmentsByPatientId = async () => {
  try {
    const response = await jsonApiClient.get(
      `/api/patient/getTotalAppointmentsByPatientId`,
    );
    // console.log(response.data.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};

