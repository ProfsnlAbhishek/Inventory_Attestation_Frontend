import type { Employee } from "../types/Employee";
import api from "./axios";

export const getAllEmpUnattested = async (): Promise<Employee[]> => {
    const {data} = await api.get<Employee[]>(`/employee/unattested`);
    return data;
}

export const getEmpAttested = async (): Promise<boolean> =>{
    const {data} = await api.get<boolean>(`/employee/attested`);
    return data;
}

export const getEmpInfo = async (): Promise<Employee> => {
    const {data} = await api.get<Employee>(`/employee/info`);
    return data;
}