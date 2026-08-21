import { useQuery } from "@tanstack/react-query";
import type { Item } from "../../../types/Item";
import { getITItemsByLocation } from "../../../api/inventory";


export function useITItemsByLocation(){     
    return useQuery<Item[]>({
        queryKey: ["attestation", "it", ],
        queryFn: ()=> getITItemsByLocation(),
        
    })
}
