import { AddDoctor, AdReceptionist } from '../types/package';
import { jsonApiClient } from './api';

export async function AddDoctorApi({
  username,
  email,
  specialist,
  dob,
  gender,
  mobileNumber,
  address,
  password,
}: AddDoctor): Promise<any> {
  try {
    const response = await jsonApiClient.post('/api/admin/addDoctor', {
      username,
      email,
      specialist,
      dob,
      gender,
      mobileNumber,
      address,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Create failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}

export async function SendOtpApi(email: string): Promise<any> {
  try {
    const response = await jsonApiClient.post('/api/admin/sendOtp', {
      email,
    });
    console.log(email);

    return response.data;
  } catch (error) {
    console.error('Create failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}

export async function VerifyOtpApi(email: string, otp: string): Promise<any> {
  try {
    const response = await jsonApiClient.post('/api/admin/verifyOtp', {
      email,
      otp,
    });

    return response.data;
  } catch (error) {
    console.error('Create failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}

export async function AddReceptionistApi({
  username,
  email,
  dob,
  gender,
  mobileNumber,
  address,
  password,
  doctor,
}: AdReceptionist): Promise<any> {
  try {
    const response = await jsonApiClient.post('/api/admin/addReceptionist', {
      username,
      email,
      dob,
      gender,
      mobileNumber,
      address,
      password,
      doctor,
    });
    return response.data;
  } catch (error) {
    console.error('Create failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}
export async function getUnassingnedDoctor(): Promise<any> {
  try {
    const response = await jsonApiClient.get('/api/admin/unassignedDoctors');
    return response.data;
  } catch (error) {
    console.error('Get failed:', error); // Logs error to the console for debugging
    throw error; // Re-throws error for upstream handling
  }
}

export const fetchVerifiedUsers = async (searchQuery = '') => {
  try {
    console.log('Search query:', searchQuery);

    // Call the API with the search query as a query parameter
    const response = await jsonApiClient.get('/api/admin/verifiedUserDetails', {
      params: { search: searchQuery },
    });

    if (response.data.success) {
      // Handle the response data (doctors and receptionists)
      const { doctors, receptionists } = response.data.data;
      console.log('Doctors:', doctors);
      console.log('Receptionists:', receptionists);
      return { doctors, receptionists };
    } else {
      console.error('Failed to retrieve data:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const editUser = async (id: string, updatedData: any) => {
  try {
    const response = await jsonApiClient.put(
      `/api/admin/edit/${id}`,
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

export const deleteUser = async (id: string) => {
  try {
    const response = await jsonApiClient.delete(`/api/admin/delete/${id}`);
    if (response.data.success) {
      console.log(`Record deleted successfully`);
      // Optionally, you can refresh the list or update the state here
    }
  } catch (error) {
    console.error(`Error deleting:`, error);
  }
};

export const getUnVerifiedUsers = async (searchQuery = '') => {
  try {
    console.log('Search query:', searchQuery);

    // Call the API with the search query as a query parameter
    const response = await jsonApiClient.get(
      '/api/admin/unVerifiedUserDetails',
      {
        params: { search: searchQuery },
      },
    );

    if (response.data.success) {
      // Handle the response data (doctors and receptionists)
      const { doctors, receptionists } = response.data.data;
      console.log('Doctors:', doctors);
      console.log('Receptionists:', receptionists);
      return { doctors, receptionists };
    } else {
      console.error('Failed to retrieve data:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getAllUsers = async (searchQuery = '', type = 'all') => {
  try {
    console.log('Search query:', searchQuery);

    // Call the API with the search query as a query parameter
    const response = await jsonApiClient.get('/api/admin/allUserDetails', {
      params: { search: searchQuery, type },
    });

    if (response.data.success) {
      // Handle the response data (doctors and/or receptionists)
      const { doctors = [], receptionists = [] } = response.data.data;

      if (type === 'doctor') {
        console.log('Doctors:', doctors);
        return { doctors };
      } else if (type === 'receptionist') {
        console.log('Receptionists:', receptionists);
        return { receptionists };
      } else {
        console.log('Doctors:', doctors);
        console.log('Receptionists:', receptionists);
        return { doctors, receptionists };
      }
    } else {
      console.error('Failed to retrieve data:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const editProfile = async (id: string, updatedData: any) => {
  try {
    const response = await jsonApiClient.put(
      `/api/admin/editProfile/${id}`,
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
