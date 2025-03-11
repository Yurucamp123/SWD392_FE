import axios from "axios";
import { baseURL } from "./baseURL";

export const getAllSuppliers = async () =>{
    return axios.get(`${baseURL}/Supplier`);
}