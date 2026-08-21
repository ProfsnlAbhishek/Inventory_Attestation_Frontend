import { useQuery } from "@tanstack/react-query";
import { getEmpAttested } from "../../../api/employee";


export function useEmpAttested(){
    return useQuery<boolean>({
        queryKey: ["employee", "attested"],
        queryFn: () => getEmpAttested(),
    })
}