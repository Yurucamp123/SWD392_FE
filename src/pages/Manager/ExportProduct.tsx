import React, { useState, ChangeEvent, FormEvent } from "react";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Các kiểu dữ liệu cần thiết (Product, Shelf)
interface ExportProductDetails {
    productId: string; // Mã sản phẩm (productId từ bảng Products)
    quantity: number; // Số lượng xuất
    price: number; // Giá xuất
    exportDate: string; // Ngày xuất kho
    shelf: string; // Kệ lưu trữ sản phẩm
    lot: string; // Lô sản phẩm (chỉ hiển thị khi chọn shelf)
    note: string; //
    proof: string,
}

const ExportProduct: React.FC = () => {
    const [exportDetails, setExportDetails] = useState<ExportProductDetails>({
        productId: "",
        quantity: 0,
        price: 0,
        exportDate: "",
        shelf: "",
        lot: "",
        note: "",
        proof: "",
    });

    const navigate = useNavigate();

    // Hàm xử lý thay đổi input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExportDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý thay đổi ngày tháng
    const handleDateChange = (date: string, field: string) => {
        setExportDetails((prev) => ({ ...prev, [field]: date }));
    };

    // Hàm xử lý khi chọn lot
    const handleLotChange = (e: ChangeEvent<HTMLSelectElement>) => {
        // Kiểm tra nếu shelf chưa được chọn thì không cho chọn lot
        if (!exportDetails.shelf) {
            toast.error("Please select a shelf before selecting a lot.");
            return;
        }
        setExportDetails((prev) => ({ ...prev, lot: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!exportDetails.productId ||
            !exportDetails.quantity ||
            !exportDetails.price ||
            !exportDetails.exportDate ||
            !exportDetails.shelf ||
            !exportDetails.lot
        ) {
            toast.error("All fields are required except the note.");
            return;
        }

        // Validate quantity
        if (exportDetails.quantity <= 0 || exportDetails.quantity > 10000) {
            toast.error("Quantity must be greater than 0 and less than 10000.");
            return;
        }

        // Validate price
        if (exportDetails.price < 0 || exportDetails.price > 100000) {
            toast.error("Price must be greater than or equal to 0 and less than 100000.");
            return;
        }

        // Validate exportDate (can't be in the future)
        const today = new Date();
        const exportDate = new Date(exportDetails.exportDate);
        if (exportDate > today) {
            toast.error("Export date cannot be in the future.");
            return;
        }

        // Validate file type (proof)
        const proofFile = (document.querySelector('input[type="file"]') as HTMLInputElement).files?.[0];
        if (proofFile && proofFile.size > 10 * 1024 * 1024) { // 10MB
            toast.error("Proof file size must not exceed 10MB.");
            return;
        }
        
        if (proofFile && !["image/jpeg", "image/png", "application/pdf"].includes(proofFile.type)) {
            toast.error("Proof file must be an image (JPEG, PNG) or PDF.");
            return;
        }

        // If all validations passed, submit form
        try {
            alert("Product exported successfully!");
            // Handle your API call here
        } catch (error) {
            toast.error("Failed to export product");
        }
    };

    // Options mẫu cho SelectGroupTwo
    const productOptions = [
        { value: "product1", label: "Product 1" },
        { value: "product2", label: "Product 2" },
        { value: "product3", label: "Product 3" }
    ];

    const shelfOptions = [
        { value: "shelf1", label: "Shelf 1" },
        { value: "shelf2", label: "Shelf 2" },
        { value: "shelf3", label: "Shelf 3" }
    ];

    const lotOptions = [
        { value: "lot1", label: "Lot 1" },
        { value: "lot2", label: "Lot 2" },
        { value: "lot3", label: "Lot 3" },
    ];

    return (
        <>
            <Breadcrumb pageName="Export Product from Warehouse" />

            <div className="grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* <!-- Product Information --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Export Product Information</h3>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">
                            {/* Chọn sản phẩm */}
                            <div>
                                <SelectGroupTwo
                                    label="Product"
                                    name="productId"
                                    value={exportDetails.productId}
                                    onChange={handleInputChange}
                                    options={productOptions}
                                />
                            </div>

                            {/* Số lượng */}
                            <div>
                                <label className="mb-3 block text-black dark:text-white">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={exportDetails.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter quantity"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                            </div>

                            {/* Giá xuất */}
                            <div>
                                <label className="mb-3 block text-black dark:text-white">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={exportDetails.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                />
                            </div>

                            {/* Ngày xuất kho */}
                            <div>
                                <label className="mb-3 block text-black dark:text-white">Export Date</label>
                                <DatePickerOne
                                    selectedDate={exportDetails.exportDate}
                                    onChange={(date: string) => handleDateChange(date, "exportDate")}
                                />
                            </div>

                            {/* Kệ */}
                            <div>
                                <SelectGroupTwo
                                    label="Shelf"
                                    name="shelf"
                                    value={exportDetails.shelf}
                                    onChange={handleInputChange}
                                    options={shelfOptions}
                                />
                            </div>

                            {/* Chọn lô */}
                            <div>
                                <SelectGroupTwo
                                    label="Lot"
                                    name="lot"
                                    value={exportDetails.lot}
                                    onChange={handleLotChange}
                                    options={lotOptions}
                                />
                            </div>

                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Export product note
                                </label>
                                <textarea
                                    value={exportDetails.note}
                                    onChange={handleInputChange}
                                    rows={6}
                                    placeholder="Note"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                ></textarea>
                            </div>

                            <div>
                                <label className="mb-3 block text-black dark:text-white">
                                    Proof of Export Product
                                </label>
                                <input
                                    type="file"
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="flex justify-center p-6.5">
                                <button
                                    onClick={handleSubmit}
                                    className="rounded-md bg-blue-600 text-white px-6 py-3"
                                >
                                    Export Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExportProduct;
