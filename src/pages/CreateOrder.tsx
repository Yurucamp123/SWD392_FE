import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // For displaying error messages
import { DeleteOutlined } from '@ant-design/icons'; // Import delete icon from Ant Design
import { getListPlatforms, getListProducts, getListSuppliers } from "../fetch/order";
import { createOrder } from "../fetch/order"; // Import the createOrder API function
import { accountListLoader } from "../fetch/account";
import { getUserInfo } from "../util/auth";
import { useNavigate } from "react-router-dom";
import { formatDate, formatNumber } from "../util/convertUtils";
import Select from 'react-select';
const CreateOrder: React.FC = () => {
    // State for the order fields
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState({
        platformId: "",
        orderDate: "",
        supplierId: "",
        totalPrice: 0,
        status: "In Progress",
    });

    // State for the products in the order
    const [orderItems, setOrderItems] = useState<any[]>([]);

    // Simulating data for products, platforms, and suppliers
    const [products, setProducts] = useState<any[]>([]);
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [userId, setUserId] = useState(null);

    async function fetchUserId() {
        const response = await accountListLoader();
        if (response.statusCode === 200) {
            const listAccount = response.result;
            const userIdFetch = listAccount.find((account: { email: string }) =>
                account.email === getUserInfo()?.email).id;
            setUserId(userIdFetch);
        }
    }

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        // Simulate fetching product, platform, and supplier data
        const fetchData = async () => {
            const platformData = await getListPlatforms();
            setPlatforms(platformData.result.map((platformItem: { platformId: number, name: string }) => ({
                id: platformItem.platformId,
                name: platformItem.name
            })));

            const productData = await getListProducts();
            setProducts(productData.result.products.map((productData: {
                sku: string,
                productName: string, basePrice: number,
                productId: string, createdAt: string
            }) => ({
                id: productData.sku,
                name: productData.productName,
                price: productData.basePrice,
                productId: productData.productId,
                createdAt: productData.createdAt,
            })));

            const supplierData = await getListSuppliers();
            setSuppliers(supplierData.result.suppliers.map((supplierItem: { supplierId: number, name: string }) => ({
                id: supplierItem.supplierId,
                name: supplierItem.name
            })));
        };

        fetchData();
    }, []);

    // Handle input changes for order details
    const handleOrderDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number) => {
        const { name, value } = e.target;
        const updatedItems = [...orderItems];

        if (name === "productId") {
            const selectedProduct = products.find(product => product.id === value);

            // Kiểm tra trùng tên sản phẩm
            const sameNameProducts = products.filter(product => {
                return product.productId !== value && product.name === selectedProduct?.name;
            })

            if (sameNameProducts.length > 0) {
                const latestProduct = sameNameProducts.reduce((prev, current) => {
                    return new Date(prev.createdAt) < new Date(current.createdAt) ? prev : current;
                });

                // Nếu sản phẩm được chọn không phải là sản phẩm có ngày tạo sớm nhất
                if (latestProduct && latestProduct.productId !== selectedProduct.productId) {
                    toast.error(`The product ${selectedProduct?.name} should be the earliest created one.`);
                    return;
                }
            }

            if (selectedProduct) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    [name]: value,
                    price: selectedProduct.price,
                    totalPrice: updatedItems[index].quantity * selectedProduct.price,
                    id: selectedProduct.productId
                };
            }
        } else if (name === "quantity") {
            const newQuantity = Number(value);
            if (newQuantity > 100000) {
                toast.error("Quantity must be less than or equal to 100000.");
                return;
            }
            updatedItems[index].quantity = newQuantity;
            updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].price;
        } else {
            updatedItems[index] = { ...updatedItems[index], [name]: value };
        }

        setOrderItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    const addProduct = () => {
        setOrderItems([
            ...orderItems,
            {
                productId: "",
                quantity: 1,
                price: 0,  // Mặc định giá là 0, nhưng sẽ được cập nhật khi chọn sản phẩm
                totalPrice: 0,
                notes: "",
            },
        ]);
    };

    // Function to delete a product from the order items
    const deleteProduct = (index: number) => {
        const updatedItems = orderItems.filter((_, idx) => idx !== index);
        setOrderItems(updatedItems);

        // Recalculate overall total price
        calculateTotalPrice(updatedItems);
    };

    // Function to calculate the total price of the order
    const calculateTotalPrice = (updatedItems: any[]) => {
        const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
        setOrderDetails((prev) => ({ ...prev, totalPrice: newTotalPrice }));
    };

    // Handle form submission (simulating an API call)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!orderDetails.platformId || !orderDetails.supplierId) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (orderItems.length === 0 || orderItems.some((item) => !item.productId || !item.quantity)) {
            toast.error("Please add products with valid quantities.");
            return;
        }

        try {
            const submitData = {
                userId: userId,
                platformId: parseInt(orderDetails.platformId),
                platformOrderId: "string",
                orderDate: new Date().toISOString(),
                orderItems: orderItems.map(item => ({
                    productId: parseInt(item.id),
                    quantity: item.quantity,
                })),
            };

            const response = await createOrder(submitData);

            if (response.statusCode === 201) {
                navigate("/manager/order-history")
                toast.success("Order created successfully!");
            } else {
                toast.error(response[0]);
            }
        } catch (error: any) {
            toast.error("An error ocurred! Please try again");
        }
    };

    const getAvailableProducts = (index: number) => {
        const selectedProductIds = orderItems.map((item, idx) => (idx !== index ? item.productId : null));
        return products.filter((product) => !selectedProductIds.includes(product.id));
    };

    return (
        <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">Create New Order</h3>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Platform */}
                <div>
                    <label className="block text-gray-600">Platform</label>
                    <select
                        name="platformId"
                        value={orderDetails.platformId}
                        onChange={handleOrderDetailsChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    >
                        <option value="">Select Platform</option>
                        {platforms.map((platform) => (
                            <option key={platform.id} value={platform.id}>
                                {platform.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-gray-600">Status</label>
                    <select
                        name="status"
                        value={orderDetails.status}
                        onChange={handleOrderDetailsChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Supplier */}
                <div>
                    <label className="block text-gray-600">Supplier</label>
                    <select
                        name="supplierId"
                        value={orderDetails.supplierId}
                        onChange={handleOrderDetailsChange}
                        className="w-full border rounded-lg px-4 py-2 mt-1"
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Add Product Table */}
                <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900">Add Products</h4>
                    <button
                        type="button"
                        onClick={addProduct}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
                    >
                        Add Product
                    </button>

                    {orderItems.map((item, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="flex items-center gap-4">
                                {/* Product Select */}
                                <div className="w-1/3">
                                    <label className="block text-gray-600">Product</label>
                                    <Select
                                        name="productId"
                                        value={getAvailableProducts(index).find(product => product.id === item.productId) ? {
                                            label: `${getAvailableProducts(index).find(product => product.id === item.productId)?.name} - ${formatDate(getAvailableProducts(index).find(product => product.id === item.productId)?.createdAt)}`,
                                            value: item.productId
                                        } : null}
                                        onChange={(selectedOption) => {
                                            handleProductChange({ target: { name: "productId", value: selectedOption?.value } } as React.ChangeEvent<HTMLInputElement>, index);
                                        }}
                                        options={getAvailableProducts(index).map((product) => ({
                                            label: `${product.name} - ${formatDate(product.createdAt)}`, // Hiển thị tên sản phẩm và ngày tạo
                                            value: product.id
                                        }))}
                                        className="w-full border rounded-lg"
                                        placeholder="Select Product"
                                    />
                                </div>

                                {/* Quantity Input */}
                                <div className="w-1/6">
                                    <label className="block text-gray-600">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleProductChange(e, index)} // Đảm bảo gọi handleProductChange khi giá trị thay đổi
                                        className="w-full border rounded-lg px-4 py-2"
                                        min="1"
                                    />
                                </div>

                                {/* Price Input */}
                                <div className="w-1/6">
                                    <label className="block text-gray-600">Price ($)</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formatNumber(item.price)}
                                        onChange={(e) => handleProductChange(e, index)}
                                        className="w-full border rounded-lg px-4 py-2"
                                        min="0"
                                        disabled
                                    />
                                </div>

                                {/* Total Price Display */}
                                <div className="w-1/6">
                                    <label className="block text-gray-600">Total Price ($)</label>
                                    <input
                                        type="text"
                                        value={formatNumber(item.totalPrice)}
                                        disabled
                                        className="w-full border rounded-lg px-4 py-2"
                                    />
                                </div>

                                {/* Delete Button */}
                                <div>
                                    <DeleteOutlined
                                        onClick={() => deleteProduct(index)}
                                        className="text-red-600 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Display Total Price */}
                <div className="mt-4">
                    <label className="block text-gray-600 font-semibold">Total Price</label>
                    <input
                        type="text"
                        value={`$${formatNumber(Number(orderDetails.totalPrice.toFixed(2)))}`} // Format the price with two decimal places
                        readOnly
                        className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100 text-gray-600"
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                        Create Order
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrder;
