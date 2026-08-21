import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventory } from "../../../api/inventory";
import type { Item } from "../../../types/Item";

export function useUpdateInventory() {
  const qc = useQueryClient();

  return useMutation<{ success: string }, Error, Item[][]>({
    mutationFn: (payload) => updateInventory(payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["attestation", "it"],
      });

      qc.invalidateQueries({
        queryKey: ["attestation", "maint"],
      });
    },
  });
}