import axios from "axios"
import { baseURL } from "./baseURL";

export const createLots = async (body: any) => {
    return axios.post(`${baseURL}/Lot`, body);
}
export const getLots = async (pageNumber:number, pageSize: number) => {
    return axios.get(`${baseURL}/Lot`,{
        params:{
            pageNumber,
            pageSize
        }
    });
}
export const getAllLots = async () =>{
    return axios.get(`${baseURL}/Lot`);
}
export const updateLots = async (lotId: number, body: any) => {
    return axios.put(`${baseURL}/Lot/${lotId}`, body);
}
export const deleteLots = async (lotId: number) => {
    return axios.delete(`${baseURL}/Lot/${lotId}`);
}
