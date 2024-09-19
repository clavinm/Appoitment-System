import { AddPatient } from '../types/package';
import { jsonApiClient } from './api';

export async function addPatient({
  username,
  email,
  mobileNumber,
  dob,
  gender,
  address,
}: AddPatient): Promise<any> {
  try {
    const response = await jsonApiClient.post('/api/receptionist/addPatient', {
      username,
      email,
      mobileNumber,
      dob,
      gender,
      address,
    });
    return response.data;
  } catch (error) {
    console.error('Create failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}

export const fetchAllPatients = async (searchQuery = '') => {
  try {

    // Call the API with the search query as a query parameter
    const response = await jsonApiClient.get('/api/receptionist/alllPatients', {
      params: { search: searchQuery },
    });

    if (response.data.success) {
      // Handle the response data (doctors and receptionists)
      return response.data;
    } else {
      console.error('Failed to retrieve data:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const deletePatient = async (id: string) => {
  try {
    const response = await jsonApiClient.delete(
      `/api/receptionist/delete/${id}`,
    );
    if (response.data.success) {
      console.log(`Record deleted successfully`);
      // Optionally, you can refresh the list or update the state here
    }
  } catch (error) {
    console.error(`Error deleting:`, error);
  }
};

export const editPatient = async (id: string, updatedData: any) => {
  try {
    const response = await jsonApiClient.put(
      `/api/receptionist/editPatient/${id}`,
      updatedData,
    );
    if (response.data.success) {
      // showSuccessToast(`Record updated successfully`);
      console.log(`Record updated successfully`);
      // Optionally, you can refresh the list or update the state here
    }
    return response;
  } catch (error) {
    console.error(`Error updating:`, error);
  }
};

export const editRecepProfile = async (id: string, updatedData: any) => {
  try {
    const response = await jsonApiClient.put(
      `/api/receptionist/editProfile/${id}`,
      updatedData,
    );
    console.log(response);

    if (response.data.success) {
      // showSuccessToast(`Record updated successfully`);
      console.log(`Record updated successfully`);
      // Optionally, you can refresh the list or update the state here
    }
    return response;
  } catch (error) {
    console.error(`Error updating:`, error);
  }
};

export const sendDoctors = async (id: string) => {
  try {
    const response = await jsonApiClient.get(
      `/api/receptionist/sendDoctors/${id}`,
    );
    // console.log('hello', response);
    return response.data;
  } catch (error) {
    console.error(`Error updating:`, error);
  }
};

//getSlotsForDate

export const getSlotsForDate = async (updateData: any) => {
  console.log(updateData);

  try {
    const response = await jsonApiClient.post(
      `/api/receptionist/getSlotsForDate`,
      updateData,
    );
    return response;
  } catch (error) {
    console.error(`Error updating:`, error);
    throw error;
  }
};

export const createAppointment = async (updateData: any) => {
  console.log(updateData);

  try {
    const response = await jsonApiClient.post(
      `/api/receptionist/createAppointment`,
      updateData,
    );
    return response;
  } catch (error) {
    console.error(`Error updating:`, error);
    throw error;
  }
};

//appoitmentPatientDetails

export const appoitmentPatientDetails = async (
  slotId: string,
  search: string,
) => {
  try {
    const response = await jsonApiClient.post(
      '/api/receptionist/appoitmentPatientDetails',
      {
        slotId,
        search,
      },
    );
    // console.log('hello', response);
    return response.data;
  } catch (error) {
    console.error(`Error updating:`, error);
    throw error;
  }
};
//
export const slotDetailsById = async (slotId: string) => {
  try {
    const response = await jsonApiClient.post(
      '/api/receptionist/slotDetailsById',
      {
        slotId,
      },
    );
    // console.log('hello', response);
    return response.data;
  } catch (error) {
    console.error(`Error updating:`, error);
  }
};
//deleteAppointment
export const deleteAppointment = async (appointmentId: string) => {
  try {
    const response = await jsonApiClient.post(
      '/api/receptionist/deleteAppointment',
      {
        appointmentId,
      },
    );
    console.log('hello', response);
    return response.data;
  } catch (error) {
    console.error(`Error updating:`, error);
    throw error;
  }
};


export const receptionistResetPassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await jsonApiClient.post(
      `/api/receptionist/receptionistResetPassword`,
      {
        email,
        oldPassword,
        newPassword,
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
