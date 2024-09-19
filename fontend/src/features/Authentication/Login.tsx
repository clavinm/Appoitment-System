import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from './useLogin';

export default function Login() {
  const [role, setRole] = useState('');
  const { login } = useLogin();
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  // console.log(role);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem('userid', role);
    if (!email || !password) return;

    login(
      { email, password, userid: role },
      {
        onSettled: () => {
          setUsername('');
          setPassword('');
        },
      },
    );
  }
  async function handlePatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    localStorage.setItem('userid', role);
    // if (!code) return;

    login(
      { code, userid: role },
      {
        onSettled: () => {
          setUsername('');
          setPassword('');
        },
      },
    );
    // console.log('res patient', res);
  }
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <a
        href="/"
        className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
      >
        <span>Appointment System</span>
      </a>
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to {role} account
        </h2>

        {!role && (
          <div className="mt-4">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Role
            </span>
            <div className="flex items-center mb-2">
              <input
                id="admin"
                type="radio"
                name="role"
                value="admin"
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => setRole(e.target.value)}
              />
              <label
                htmlFor="admin"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Admin
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                id="doctor"
                type="radio"
                name="role"
                value="doctor"
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => setRole(e.target.value)}
              />
              <label
                htmlFor="doctor"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Doctor
              </label>
            </div>
            <div className="flex items-center mb-2">
              <input
                id="receptionist"
                type="radio"
                name="role"
                value="receptionist"
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => setRole(e.target.value)}
              />
              <label
                htmlFor="receptionist"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Receptionist
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="patient"
                type="radio"
                name="role"
                value="patient"
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => setRole(e.target.value)}
              />
              <label
                htmlFor="patient"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Patient
              </label>
            </div>
          </div>
        )}

        {role &&
          (role !== 'patient' ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              {role !== 'admin' && (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>

                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="font-medium text-gray-900 dark:text-white"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  style={{ backgroundColor: '#4686e5' }}
                >
                  Login to your account
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handlePatient}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Code
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter Your Code"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  style={{ backgroundColor: '#4686e5' }}
                >
                  Login to your account
                </button>
              </div>
            </form>
          ))}
      </div>
    </div>
  );
}
