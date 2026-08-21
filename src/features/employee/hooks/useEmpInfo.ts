import { useQuery } from "@tanstack/react-query";
import { getEmpInfo } from "../../../api/employee";
import type { Employee } from "../../../types/Employee";


export function useEmpInfo(){
    return useQuery<Employee>({
        queryKey: ["employee", "info"],
        queryFn: () => getEmpInfo(),
    })
}