import React, { useState, ChangeEvent } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';

const InventoryTracking: React.FC = () => {
    // Dữ liệu mẫu cho sản phẩm trong kho
    const sampleStockData = [
        { productId: 'P001', productName: 'Product A', sku: 'A001', quantity: 100, updatedQuantity: 100 },
        { productId: 'P002', productName: 'Product B', sku: 'B002', quantity: 200, updatedQuantity: 200 },
        { productId: 'P003', productName: 'Product C', sku: 'C003', quantity: 50, updatedQuantity: 50 },
    ];

    const [stockData, setStockData] = useState(sampleStockData);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Hàm xử lý khi thay đổi số lượng sản phẩm
    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>, productId: string) => {
        const updatedData = stockData.map((item) =>
            item.productId === productId
                ? { ...item, updatedQuantity: parseInt(e.target.value) }
                : item
        );
        setStockData(updatedData);
    };

    // Hàm xử lý khi chọn ngày
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    // Hàm xác nhận thay đổi kho
    const handleConfirmStockChange = () => {
        // Logic xác nhận thay đổi kho
        setAlertMessage('Stock changes confirmed successfully!');
    };

    return (
        <>
            <Breadcrumb pageName="Inventory Tracking" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* Select Date */}
                    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Select Date</h3>
                        </div>
                        <div className="p-6.5 flex justify-between items-center">
                            <DatePickerOne
                                selectedDate={selectedDate}
                                onChange={handleDateChange}
                            />

                            <button
                                onClick={handleConfirmStockChange}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md4"
                            >
                                Confirm Stock Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-9">
                {/* Stock Products List */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Confirm Stock Changes</h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Product Name</th>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">Current Quantity</th>
                                    <th className="px-4 py-2">Updated Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.map((product) => (
                                    <tr key={product.productId}>
                                        <td className="px-4 py-2 text-center">{product.productName}</td>
                                        <td className="px-4 py-2 text-center">{product.sku}</td>
                                        <td className="px-4 py-2 text-center">{product.quantity}</td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="number"
                                                value={product.updatedQuantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(e, product.productId)
                                                }
                                                className="text-center w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Alert Message */}
            {alertMessage && (
                <div className="rounded-sm border border-stroke bg-green-200 p-6.5 text-black dark:text-white">
                    <p>{alertMessage}</p>
                </div>
            )}
        </>
    );
};

export default InventoryTracking;
