
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  mutationFn: () => Promise<any>;
  invalidateKeys: [any];
};

export const useCustomMutation = ({ mutationFn, invalidateKeys }: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error, reset, status } = useMutation({
    mutationFn,
    onError: (err, newError) => {
      console.error("Error during mutation:", err);
      throw newError;
    },
    onSuccess: () => {
      // Update the query cache using the queryKey
      queryClient.invalidateQueries({
        queryKey: invalidateKeys,
      });
    },
  });

  return {
    mutate,
    isPending,
    isError,
    error,
    reset,
    status,
  };
};