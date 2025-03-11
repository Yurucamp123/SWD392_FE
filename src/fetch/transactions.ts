import { axiosInstanceJson } from "./axios-instance";

interface Filters {
    startDate: string;
    endDate: string;
    productId: string;
    lotId: string;
    type: string;
    page: number;
    pageSize: number;
}

export const fetchTransactions = async (filters: Filters) => {
    const params = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        productId: filters.productId,
        lotId: filters.lotId,
        type: filters.type,
        page: filters.page,
        pageSize: filters.pageSize
    };

    return axiosInstanceJson.get('/api/StockTransaction', { params })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            const errors = error.response?.data?.errorMessages || error.response?.data?.errors || [];
            return errors;
        });
};
