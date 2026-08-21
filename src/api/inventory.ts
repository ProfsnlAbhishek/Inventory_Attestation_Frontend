import type { Item } from "../types/Item";
import api from "./axios";

export const getMaintItemsByLocation = async (): Promise<Item[]> =>{
    const {data} = await api.get<Item[]>(`/inventory/maint/`)
    return data;
}

export const getITItemsByLocation = async (): Promise<Item[]> =>{
    const {data} = await api.get<Item[]>(`/inventory/it/`)
    return data;
}
export const getItemByAssetTag = async (id: string): Promise<Item> =>{
    const {data} = await api.get<Item>(`/inventory/asset_tag/${id}`)
    return data;
}

export const updateInventory = async (
  payload: Item[][]
): Promise<{ success: string }> => {
  const { data } = await api.put<{ success: string }>(
    `/inventory/update/`,
    payload
  );

  return data;
};