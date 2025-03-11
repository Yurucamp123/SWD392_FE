import { axiosInstanceJson } from "./axios-instance"

export const accountListLoader = async () => {
    const data = await axiosInstanceJson.get('/api/Auth').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const createAccountAction = async (account: {
    username: string;
    password: string;
    roles: string[];
}) => {
    const data = await axiosInstanceJson.post('/api/Auth/register', account).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const updateAccountAction = async (id: string | undefined,
    account: {
        email: string, roles: string[],
        phoneNumber: string, status: boolean
    }) => {
    const data = await axiosInstanceJson.put(`/api/Auth/edit-user/${id}`, account).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const deleteAccountAction = async (id: string) => {
    const data = await axiosInstanceJson.delete(`/api/Auth/delete-user/${id}`).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}