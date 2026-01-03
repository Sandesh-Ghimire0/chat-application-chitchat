import { useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/client";

export const useAuthUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<User>(["authUser"]);
};
