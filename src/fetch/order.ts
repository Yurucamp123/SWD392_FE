import { axiosInstanceJson } from "./axios-instance"

export const getListLots = async () => {
    const data = await axiosInstanceJson.get('/api/Lot?pageNumber=1&pageSize=1000').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const getListPlatforms = async () => {
    const data = await axiosInstanceJson.get('/api/Platform').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const getListProducts = async () => {
    const data = await axiosInstanceJson.get('/api/Product?pageName=1&pageSize=1000').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const getProductById = async (id: number) => {
    const data = await axiosInstanceJson.get('/api/Product/by-id/' + id).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const getListSuppliers = async () => {
    const data = await axiosInstanceJson.get('/api/Supplier').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

export const getListOrders = async () => {
    const data = await axiosInstanceJson.get('/api/Order?pageNumber=1&pageSize=1000').then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}

interface OrderItem {
    orderItemId: number;
    quantity: number;
}

interface ProductItem {
    productId: number;
    quantity: number;
}

export const updateOrderById = async (id: number, submitData: {
    orderStatus: boolean,
    orderItems: OrderItem[]
}) => {
    const data = await axiosInstanceJson.put('/api/Order/' + id, submitData)
        .then((response) => {
            return response.data
        }
        ).catch((error) => {
            const errors = error.response.data.errorMessages || error.response.data.errors || []
            return errors
        })

    return data
}

export const createOrder = async (submitData: {
    userId: string | null,
    platformId: number,
    orderDate: string,
    platformOrderId: string
    orderItems: ProductItem[]
}) => {
    const data = await axiosInstanceJson.post('/api/Order', submitData)
        .then((response) => {
            return response.data
        }
        ).catch((error) => {
            const errors = error.response.data.errorMessages || error.response.data.errors || []
            return errors
        })
    return data
}

export const getPlatformById = async (id: number) => {
    const data = await axiosInstanceJson.get('/api/Platform/' + id).then((response) => {
        return response.data
    }
    ).catch((error) => {
        const errors = error.response.data.errorMessages || error.response.data.errors || []
        return errors
    })

    return data
}