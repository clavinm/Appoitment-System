import { useMutation } from '@tanstack/react-query';
import { AddDoctorApi } from '../../services/AdminApi';
import { useAlert } from '../../hooks/useAlert';
import { AddDoctor } from '../../types/package';

export function useAddDoctor() {
  // const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useAlert();
  const { mutate: addDoctor, isPending: isLoading } = useMutation({
    mutationFn: ({
      username,
      email,
      specialist,
      dob,
      gender,
      mobileNumber,
      address,
      password,
    }: AddDoctor) =>
      AddDoctorApi({
        username,
        email,
        specialist,
        dob,
        gender,
        mobileNumber,
        address,
        password,
      }),
    onSuccess: () => {
      showSuccessToast('Doctor created Successfully');
    },
    onError: (error: Error & { response?: { data: any } }) => {
      showErrorToast(error.message || error?.response?.data.message);
    },
  });

  return { addDoctor, isLoading };
}
