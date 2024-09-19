import { jsonApiClient } from './api';

//editProfile
export const editDoctorProfile = async (id: string, updatedData: any) => {
  try {
    const response = await jsonApiClient.put(
      `/api/doctor/editProfile/${id}`,
      updatedData,
    );
    console.log(response);

    if (response.data.success) {
      // showSuccessToast(`Record updated successfully`);
      console.log(`Record updated successfully`);
    }
    return response;
  } catch (error) {
    console.error(`Error updating:`, error);
  }
};

export const createSlots = async (slotsData: any) => {
  try {
    console.log(slotsData, 'slotsData');

    const response = await jsonApiClient.post(
      `/api/doctor/createSlots`,
      slotsData,
    );

    return response;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};

//
export const getPatientsForDoctor = async (doctorId: string, date: string) => {
  try {
    const response = await jsonApiClient.post(
      `/api/doctor/getPatientsForDoctor`,
      { doctorId, date },
    );
    // console.log(response.data.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
//upload
export const chatUpload = async (formData: any) => {
  // console.log(formData, 'formData');

  try {
    const response = await jsonApiClient.post(`/api/doctor/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the content type is set for FormData
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};

//email, oldPassword, newPassword
//resetPassword
export const resetPassword = async ({
  email,
  oldPassword,
  newPassword,
}: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await jsonApiClient.post(`/api/doctor/resetPassword`, {
      email,
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
//

export const getPatientsDoctorChat = async (searchTerm?: string) => {
  try {
    const response = await jsonApiClient.post(
      `/api/doctor/getPatientsDoctorChat`,
      { searchTerm },
    );
    // console.log(response.data.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};

export const getChatsByPatientAndDoctor = async ({
  patientId,
  date,
}: {
  patientId: string;
  date: string;
}) => {
  try {
    const response = await jsonApiClient.post(
      `/api/doctor/getChatsByPatientAndDoctor`,
      { patientId, date },
    );
    console.log(response.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
//getReceptionistById

export const getReceptionistById = async () => {
  try {
    const response = await jsonApiClient.get(`/api/doctor/getReceptionistById`);
    // console.log(response.data, 'response hello');

    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
    throw error;
  }
};
