import axios from "axios";
import { baseURL } from "./baseURL";

export const getAllUsers = async () =>{
    return axios.get(`${baseURL}/Auth`);
}