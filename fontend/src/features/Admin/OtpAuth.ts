import { useMutation } from '@tanstack/react-query';
import { SendOtpApi, VerifyOtpApi } from '../../services/AdminApi';
import { useAlert } from '../../hooks/useAlert';
// import { AddDoctor } from '../../types/package';

export function useSendOtp() {
  //   const queryClient = useQueryClient();
  const { showErrorToast } = useAlert();
  const { mutate: sendOtp, isPending: isLoading } = useMutation({
    mutationFn: (email: string) => SendOtpApi(email),

    onError: (error: Error & { response?: { data: any } }) => {
      showErrorToast(error.message || error?.response?.data.message);
    },
  });

  return { sendOtp, isLoading };
}
// export function useVerifyOtp() {
//   //   const queryClient = useQueryClient();
//   const { showSuccessToast, showErrorToast } = useAlert();
//   const { mutate: verifyOtp, isPending: isLoading } = useMutation<
//     string,
//     any,
//     { email: string; otp: string }
//   >({
//     mutationFn: ({ email, otp }) => VerifyOtpApi(email, otp),
//     onSuccess: () => {
//       showSuccessToast('Verified Successfully');
    
//     },
//     onError: (error: Error & { response?: { data: any } }) => {
//       showErrorToast(error.message || error?.response?.data.message);
//     },
//   });

//   return { verifyOtp, isLoading };
// }
