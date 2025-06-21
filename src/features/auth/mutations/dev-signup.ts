import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { devSignUpService, type DevSignUpData } from "@/services/dev-signup";

export const useDevSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: DevSignUpData) => devSignUpService.signUp(data),
    onSuccess: () => {
      navigate({ to: "/auth/sign-in" });
      toast.success("Dev sign-up successful");
    },
    onError: (error) => {
      toast.error("Dev sign-up failed");
      console.error("Dev sign-up failed:", error);
    },
  });
};
