import { useMutation } from '@tanstack/react-query';
import { AddReceptionistApi } from '../../services/AdminApi';
import { useAlert } from '../../hooks/useAlert';
import { AdReceptionist } from '../../types/package';

export function useAddReceptionist() {
  // const queryClient = useQueryClient();
  const { showSuccessToast, showErrorToast } = useAlert();
  const { mutate: addReceptionist, isPending: isLoading } = useMutation({
    mutationFn: ({
      username,
      email,
      dob,
      gender,
      mobileNumber,
      address,
      password,
      doctor,
    }: AdReceptionist) =>
      AddReceptionistApi({
        username,
        email,
        dob,
        gender,
        mobileNumber,
        address,
        password,
        doctor,
      }),
    onSuccess: () => {
      showSuccessToast('Receptionist created Successfully');
    },
    onError: (error: Error & { response?: { data: any } }) => {
      showErrorToast(error.message || error?.response?.data.message);
    },
  });

  return { addReceptionist, isLoading };
}
