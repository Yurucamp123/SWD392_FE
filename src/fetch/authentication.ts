import { axiosInstanceJson } from "./axios-instance"
import { jwtDecode } from 'jwt-decode';

export const loginAction = async (username: string, password: string): Promise<any> => {
    const data = await axiosInstanceJson.post('/api/Auth/login', {
        username,
        password
    }).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

// Define the type for the decoded token
export interface DecodedToken {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    jti: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string[];
    exp: number;
    iss: string;
    aud: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
};