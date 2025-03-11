import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { fetchTransactions } from '../../fetch/transactions.ts';
import { getListLots, getListProducts } from '../../fetch/order.ts';
import { Pagination } from 'antd';
import * as XLSX from 'xlsx';  // Import thư viện xlsx
import { formatDate } from '../../util/convertUtils.ts';
const pageSize = 10

const TransactionManagement: React.FC = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [products, setProducts] = useState<any[]>([]);
    const [lots, setLots] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        productId: '',
        lotId: '',
        type: 'Import', // Kiểu giao dịch (Import/Export)
        page: 1,
        pageSize: 1000
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Hàm fetch dữ liệu từ API
    async function handleFetchTransaction() {
        const response = await fetchTransactions(filters);
        if (response.statusCode === 200) {
            setTransactions(response.result.items);
            setFilteredTransactions(response.result.items); // Đặt filteredTransactions bằng dữ liệu nhận được
        } else {
            toast.error('Failed to fetch transaction data');
        }
    }

    async function handleFetchProducts() {
        const productData = await getListProducts();
        setProducts(productData.result.products.map((productData: { productName: string, productId: string }) => ({
            productId: productData.productId,
            name: productData.productName,
        })));
    }

    async function handleFetchLots() {
        const lotData = await getListLots();
        setLots(lotData.result.lots.map((lotData: { lotId: number, lotCode: string }) => ({
            lotId: lotData.lotId,
            lotCode: lotData.lotCode,
        })));
    }

    useEffect(() => {
        handleFetchTransaction();
        handleFetchProducts();
        handleFetchLots();
    }, [filters]);

    // Hàm xử lý thay đổi các trường filter
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Hàm lọc giao dịch theo kiểu (Import/Export)
    const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        // Lọc các giao dịch theo kiểu giao dịch đã chọn
        if (selectedType === '') {
            setFilteredTransactions(transactions); // Nếu không chọn lọc, hiển thị tất cả
        } else {
            setFilteredTransactions(
                transactions.filter((transaction: any) => transaction.type === selectedType)
            );
        }
    };
    // Hàm export dữ liệu ra file Excel (xlsx)
    const handleExportData = () => {
        const ws = XLSX.utils.json_to_sheet(filteredTransactions.map((transaction: any) => ({
            'Transaction ID': transaction.transactionId,
            'Product Name': transaction.productName,
            'Lot Code': transaction.lotCode,
            'Quantity': transaction.quantity,
            'Type': transaction.type,
            'Transaction Date': transaction.transactionDate,
            'User Name': transaction.userName
        })));

        // Tạo một workbook chứa worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        // Xuất file Excel
        XLSX.writeFile(wb, 'transactions.xlsx');
    };

    return (
        <>
            <Breadcrumb pageName="Transaction Management" />

            <div className="grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">

                    {/* Transaction Management */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
                            <h3 className="font-medium text-black dark:text-white">View Transactions</h3>
                            <button
                                onClick={handleExportData}
                                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                            >
                                Export Data
                            </button>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">
                            {/* Bộ lọc giao dịch */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 mb-4">
                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            id="startDate"
                                            value={filters.startDate}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            id="endDate"
                                            value={filters.endDate}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-full">
                                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product</label>
                                        <select
                                            name="productId"
                                            id="productId"
                                            value={filters.productId}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                            <option value="">Select Product</option>
                                            {products.map((product) => (
                                                <option key={product.productId} value={product.productId}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="lotId" className="block text-sm font-medium text-gray-700">Lot</label>
                                        <select
                                            name="lotId"
                                            id="lotId"
                                            value={filters.lotId}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                            <option value="">Select Lot</option>
                                            {lots.map((lot) => (
                                                <option key={lot.lotId} value={lot.lotId}>
                                                    {lot.lotCode}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            name="type"
                                            id="type"
                                            value={filters.type}
                                            onChange={handleFilterChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                        >
                                            <option value="Import">Import</option>
                                            <option value="Export">Export</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Bảng giao dịch */}
                            <table className="w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Transaction ID</th>
                                        <th className="px-4 py-2 text-left">Product Name</th>
                                        <th className="px-4 py-2 text-left">Lot Code</th>
                                        <th className="px-4 py-2 text-left">Quantity</th>
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Transaction Date</th>
                                        <th className="px-4 py-2 text-left">User Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions.map((transaction: any) => (
                                        <tr key={transaction.transactionId}>
                                            <td className="px-4 py-2 text-left">{transaction.transactionId}</td>
                                            <td className="px-4 py-2 text-left">{transaction.productName}</td>
                                            <td className="px-4 py-2 text-left">{transaction.lotCode}</td>
                                            <td className="px-4 py-2 text-left">{transaction.quantity}</td>
                                            <td className={`px-4 py-2 text-left ${transaction.type === 'Import' ? 'text-green-800' : 'text-blue-800'}`}>
                                                {transaction.type}
                                            </td>
                                            <td className="px-4 py-2 text-left">{formatDate(transaction.transactionDate)}</td>
                                            <td className="px-4 py-2 text-left">{transaction.userName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Phân trang */}
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredTransactions.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                className="mt-4 flex justify-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionManagement;
