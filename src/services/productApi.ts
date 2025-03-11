import axios from "axios"
import { baseURL } from "./baseURL";

export const createProducts = async (body: any) => {
    return axios.post(`${baseURL}/Product`, body);
}
export const getProducts = async (pageNumber:number, pageSize: number) => {
    return axios.get(`${baseURL}/Product`,{
        params:{
            pageName: pageNumber,
            pageSize
        }
    });
}
export const getAllProducts = async () =>{
    return axios.get(`${baseURL}/Product`);
}
export const updateProducts = async (productId: number, body: any) => {
    return axios.put(`${baseURL}/Product/${productId}`, body);
}
export const deleteProducts = async (productId: number) => {
    return axios.delete(`${baseURL}/Product/${productId}`);
}
export const searchProducts = async (sku: string) => {
    return axios.get(`${baseURL}/Product/search`, {
        params: {
            sku
        }
    });
}
export const createProductBySuppliers = async (body: any) => {
    return axios.post(`${baseURL}/Product/createProductBySUppliers`,body);
}