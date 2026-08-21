import { useQuery } from "@tanstack/react-query";
import type { Item } from "../../../types/Item";
import { getMaintItemsByLocation } from "../../../api/inventory";


export function useMaintItemsByLocation(){     
    return useQuery<Item[]>({
        queryKey: ["attestation", "maint"],
        queryFn: ()=>getMaintItemsByLocation(),
        
    })
}
