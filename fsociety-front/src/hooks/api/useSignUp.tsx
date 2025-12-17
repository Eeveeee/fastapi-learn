import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../../api/signup.api";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signUp"] });
    },
  });
}
