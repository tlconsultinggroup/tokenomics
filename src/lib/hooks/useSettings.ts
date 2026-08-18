import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { AppSettings } from "../types";

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<AppSettings, Error>({
    queryKey: ["settings"],
    queryFn: () => api.settings.get(),
  });

  const updateMutation = useMutation({
    mutationFn: (settings: Partial<AppSettings>) =>
      api.settings.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
