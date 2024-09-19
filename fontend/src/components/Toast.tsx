import { createContext, useEffect, ReactNode } from 'react';
import Swal, {
  SweetAlertIcon,
  SweetAlertResult,
  SweetAlertPosition,
} from 'sweetalert2';

export interface AlertContextType {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showWarningToast: (message: string) => void;
  showInfoToast: (message: string) => void;
  showConfirmAlert: (
    title: string,
    text: string,
    confirmButtonText?: string,
    cancelButtonText?: string,
  ) => Promise<SweetAlertResult>;
  showSuccessAlert: (title: string, text: string) => Promise<SweetAlertResult>;
  showErrorAlert: (title: string, text: string) => Promise<SweetAlertResult>;
}

export const AlertContext = createContext<AlertContextType | null>(null);

interface AlertContextProviderProps {
  children: ReactNode;
}

export const AlertContextProvider = ({
  children,
}: AlertContextProviderProps) => {
  useEffect(() => {
    // Ensure the SweetAlert2 container exists and set its z-index
    const initializeSweetAlert2Container = () => {
      const container = Swal.getContainer();
      if (container) {
        container.style.zIndex = '99999';
      } else {
        // If container doesn't exist yet, try again after a short delay
        setTimeout(initializeSweetAlert2Container, 100);
      }
    };

    initializeSweetAlert2Container();
  }, []);

  const toast = (
    title: string,
    icon: SweetAlertIcon,
    position: SweetAlertPosition = 'bottom-end',
  ) => {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        container: 'swal2-toast-container dark:bg-boxdark',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
        // Set high z-index for toast container
        const toastContainer = document.querySelector(
          '.swal2-toast-container',
        ) as HTMLElement;
        if (toastContainer) {
          toastContainer.style.zIndex = '99999';
        }
      },
    });

    return Toast.fire({
      icon: icon,
      title: title,
    });
  };

  const showSuccessToast = (message: string) => toast(message, 'success');
  const showErrorToast = (message: string) => toast(message, 'error');
  const showWarningToast = (message: string) => toast(message, 'warning');
  const showInfoToast = (message: string) => toast(message, 'info');

  const showConfirmAlert = (
    title: string,
    text: string,
    confirmButtonText = 'Yes',
    cancelButtonText = 'No',
  ) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      customClass: {
        confirmButton: 'confirm-button',
        cancelButton: 'cancel-button',
        popup: 'dark:bg-boxdark dark:text-gray-300',
      },
    });
  };

  const showSuccessAlert = (title: string, text: string) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      customClass: {
        popup: 'dark:bg-boxdark dark:text-white',
      },
    });
  };

  const showErrorAlert = (title: string, text: string) => {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      customClass: {
        popup: 'dark:bg-boxdark dark:text-white',
      },
    });
  };

  const value: AlertContextType = {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    showConfirmAlert,
    showSuccessAlert,
    showErrorAlert,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export default AlertContextProvider;
