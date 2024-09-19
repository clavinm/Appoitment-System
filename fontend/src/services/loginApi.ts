import { jsonApiClient } from './api';

export interface LoginAdminParams {
  email?: string;
  password?: string;
  userid: string;
  code?: string;
}

export async function LoginAdmin({
  email,
  password,
  userid,
  code,
}: LoginAdminParams): Promise<any> {
  try {
    let response;
    if (userid === 'patient') {
      // Patient login with code
      response = await jsonApiClient.post(`/api/patient/login`, {
        code,
      });
    } else {
      // Standard login for other users
      response = await jsonApiClient.post(`/api/${userid}/login`, {
        email,
        password,
      });
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
export async function getCurrentUser() {
  const response = await jsonApiClient.get('/api/verifyProtectedRoutes');
  // console.log('response', response);

  return response.data;
}

export async function Logout() {
  const userid = localStorage.getItem('userid');
  await jsonApiClient.post(`/api/${userid}/logout`);
}
