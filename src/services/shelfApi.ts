import axios from "axios"
import { baseURL } from "./baseURL";

export const createShelfs = async (body: any) => {
    return axios.post(`${baseURL}/Shelf`, body);
}
export const getShelfs = async (pageNumber:number, pageSize: number) => {
    return axios.get(`${baseURL}/Shelf`,{
        params:{
            pageNumber,
            pageSize
        }
    });
}
export const getAllShelfs = async () =>{
    return axios.get(`${baseURL}/Shelf`);
}
export const updateShelfs = async (shelfId: number, body: any) => {
    return axios.put(`${baseURL}/Shelf/${shelfId}`, body);
}
export const deleteShelfs = async (shelfId: number) => {
    return axios.delete(`${baseURL}/Shelf/${shelfId}`);
}