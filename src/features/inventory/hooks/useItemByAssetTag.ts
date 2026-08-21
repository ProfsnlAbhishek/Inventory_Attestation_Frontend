import { useQuery } from "@tanstack/react-query";
import { getItemByAssetTag } from "../../../api/inventory";
import type { Item } from "../../../types/Item";


export function useItemByAssetTag(id: string) {
  return useQuery<Item>({
    queryKey: ["item", "assetTag", id],
    queryFn: () => getItemByAssetTag(id),
    enabled: !!id,
  });
}