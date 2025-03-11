import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Input, Modal, notification, Pagination, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { accountListLoader } from '../fetch/account';
import { getListOrders, getListProducts, getPlatformById, getProductById, updateOrderById } from '../fetch/order';
import { getUserInfo } from '../util/auth';
import { formatDate, formatNumber } from '../util/convertUtils';

const { Option } = Select;
const pageSize = 10


const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [editedOrders, setEditedOrders] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [userId, setUserId] = useState(null);
    const [allOrders, setAllOrders] = useState<any[]>([]); // State to store the original list of orders
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
    const [products, setProducts] = useState<any[]>([]);
    async function fetchUserId() {
        const response = await accountListLoader();
        if (response.statusCode === 200) {
            const listAccount = response.result;
            const userIdFetch = listAccount.find((account: { email: string }) =>
                account.email === getUserInfo()?.email).id;
            setUserId(userIdFetch);
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const fetchOrders = async () => {
        try {
            const response = await getListOrders();
            if (response.statusCode === 200 && response.isSuccess) {
                const fetchedOrders = response.result.orders;
                const ordersWithDetails = await Promise.all(fetchedOrders.map(async (order: any) => {
                    const platform = await getPlatformById(order.platformId);
                    const productsWithDetails = await Promise.all(order.orderItems.map(async (item: any) => {
                        const product = await getProductById(item.productId);
                        return {
                            ...item,
                            name: product.result.productName,
                            price: product.result.basePrice,
                        };
                    }));
                    return {
                        ...order,
                        platform: platform.result.name,
                        products: productsWithDetails,
                    };
                }));

                const sortedOrders = ordersWithDetails.sort((a, b) => {
                    const dateA = new Date(a.orderDate);
                    const dateB = new Date(b.orderDate);
                    return dateB.getTime() - dateA.getTime();  // descending order
                });
                setOrders(sortedOrders);
                setEditedOrders(sortedOrders);
                setAllOrders(sortedOrders);
            } else {
                toast.error(response[0]);
            }
        } catch (error) {
            toast.error("Failed to fetch orders.");
        }
    };

    const fetchProducts = async () => {
        const productData = await getListProducts();
        setProducts(productData.result.products.map((productData: { sku: string, productName: string, basePrice: number, productId: string }) => ({
            id: productData.sku,
            name: productData.productName,
            price: productData.basePrice,
            productId: productData.productId
        })));
    }

    useEffect(() => {
        fetchUserId();
        fetchProducts()
    }, []);
    useEffect(() => {
        fetchOrders();
    }, []);

    // Update the handleSearch function:
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase for case insensitive search

        // If search term is empty, reset to all orders
        if (searchTerm === "") {
            setOrders(allOrders);
        } else {
            const filteredOrders = allOrders.filter(order =>
                order.orderId.toString().toLowerCase().includes(searchTerm) ||
                order.platform.toLowerCase().includes(searchTerm)
            );
            setOrders(filteredOrders);
        }
    };

    const showModal = (order: any) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    console.log(selectedOrder)

    const handleModalSave = async () => {
        try {
            const submitData = {
                orderStatus: selectedOrder.orderStatus,
                orderItems: selectedOrder.products.map((item: any) => {
                    if (item.quantity < 1) {
                        throw new Error(`Quantity of ${item.name} cannot be less than 1.`);
                    }
                    return {
                        orderItemId: item.orderItemId,
                        quantity: item.quantity,
                    };
                }),
            };

            const response = await updateOrderById(selectedOrder.orderId, submitData);
            if (response.statusCode === 200) {
                const updatedOrders = editedOrders.map(order =>
                    order.orderId === selectedOrder.orderId ? selectedOrder : order
                );
                setEditedOrders(updatedOrders);
                setIsModalVisible(false);
                fetchOrders(); // Ensure the orders are re-fetched after update
                toast.success("Order updated successfully!");
            } else {
                toast.error("Failed to update order.");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred while updating the order.");
        }
    };

    const handleProductChange = (value: string, index: number) => {
        const selectedProduct = products.find(product => product.productId === value);

        if (selectedProduct) {
            setSelectedOrder((prevOrder: any) => {
                const updatedProducts = [...prevOrder.products];
                updatedProducts[index] = {
                    ...updatedProducts[index],
                    productId: selectedProduct.productId,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    totalPrice: updatedProducts[index].quantity * selectedProduct.price,
                };

                return { ...prevOrder, products: updatedProducts };
            });
        }
    };

    const getAvailableProducts = (index: number) => {
        const selectedProductIds = selectedOrder.products
            .filter((_: number, idx: number) => idx !== index)  // Loại bỏ sản phẩm đã chọn ở index hiện tại
            .map((item: { productId: string }) => item.productId); // Lấy ra các productId đã chọn

        // Trả về danh sách sản phẩm chưa được chọn
        return products.filter((product) => !selectedProductIds.includes(product.productId));
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const calculateTotalPrice = (products: any[]) => {
        return products.reduce((total, product) => total + (product.quantity * product.price), 0);
    };

    const deleteOrderItem = (productId: string) => {
        if (selectedOrder.products.length <= 1) {
            notification.error({
                message: "Error",
                description: "Cannot delete the last item in the order.",
            });
            return;
        }
        const updatedProducts = selectedOrder.products.filter((item: {
            productId: string
        }) => item.productId !== productId);
        setSelectedOrder({ ...selectedOrder, products: updatedProducts });
        toast.success("Order item deleted successfully!");
    };

    // Handle quantity change
    const handleQuantityChange = (productId: string, quantity: number) => {
        const updatedProducts = selectedOrder.products.map((item: { productId: string }) =>
            item.productId === productId
                ? { ...item, quantity: quantity }
                : item
        );
        setSelectedOrder({ ...selectedOrder, products: updatedProducts });
    };

    // Add new order item
    const addNewOrderItem = () => {
        const newProduct = {
            productId: '',
            name: '',
            quantity: 1,
            price: 0,
            orderItemId: Date.now().toString(), // Unique ID for the new item
        };
        setSelectedOrder({
            ...selectedOrder,
            products: [...selectedOrder.products, newProduct],
        });
    };

    const paginatedOrders = orders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">Order History</h3>

            <div className="mt-4 mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by Order ID or Platform"
                    className="p-2 border rounded-lg w-1/3"
                    onChange={handleSearch}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="border-b bg-gray-100 text-left">
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Order ID</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Platform</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Order Date</th>
                            <th className="px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order) => (
                                <tr key={order.orderId} className="border-b">
                                    <td className="px-6 py-3 text-sm text-gray-800">{order.orderId}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{order.platform}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <span
                                            className={`font-medium ${!order.orderStatus
                                                ? "text-green-600"
                                                : "text-blue-600"
                                                }`}
                                        >
                                            {order.orderStatus ? 'Completed' : 'In progress'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{formatDate(order.orderDate)}</td>
                                    <td className="px-6 py-3 text-sm">
                                        <EditOutlined
                                            onClick={() => showModal(order)}
                                            className="text-blue-600 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-3 text-sm text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={orders.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="mt-4 flex justify-center"
            />
            <Modal
                title="Edit Order"
                open={isModalVisible}
                onOk={handleModalSave}
                onCancel={handleModalCancel}
                footer={null}
                width={800}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Platform:</strong> {selectedOrder.platform}</p>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                            </Col>
                            <Col span={12}>
                                <p><strong>Notes:</strong> {selectedOrder.notes}</p>
                            </Col>
                        </Row>

                        <h4 className="text-lg font-medium text-gray-600">Products</h4>
                        <Table
                            dataSource={selectedOrder.products}
                            columns={[{
                                title: 'Product Name', dataIndex: 'name', key: 'name',
                                render: (_value: string, record: any, index: number) => {
                                    return (
                                        <Select
                                            value={record.productId}
                                            onChange={(value) => handleProductChange(value, index)}
                                            style={{ width: '100%' }}
                                        >
                                            {getAvailableProducts(index).map((product) => (
                                                <Option key={product.productId} value={product.productId}>
                                                    {product.name}  {/* Hiển thị tên sản phẩm */}
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                }
                            }, {
                                title: 'Quantity', dataIndex: 'quantity', key: 'quantity',
                                render: (value: number, record: any) => (
                                    <Input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleQuantityChange(record.productId, +e.target.value)}
                                        min={1}
                                    />
                                )
                            }, {
                                title: 'Price', dataIndex: 'price', key: 'price'
                            }, {
                                title: 'Total Price', key: 'totalPrice',
                                render: (_text, record:
                                    { quantity: number; price: number }) =>
                                    formatNumber(record.quantity * record.price)
                            }, {
                                title: 'Actions', key: 'actions',
                                render: (_text, record: any) => (
                                    selectedOrder.products.length > 1 ? (
                                        <div className="flex items-center space-x-2">
                                            <DeleteOutlined
                                                onClick={() => deleteOrderItem(record.productId)}
                                                className="text-red-600 cursor-pointer"
                                            />
                                            <PlusOutlined
                                                onClick={addNewOrderItem}
                                                className="text-green-600 cursor-pointer"
                                            />
                                        </div>
                                    ) : (
                                        <PlusOutlined
                                            onClick={addNewOrderItem}
                                            className="text-green-600 cursor-pointer"
                                        />
                                    )
                                )
                            }]}
                            pagination={false}
                            rowKey="productId"
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align="right">Total Price</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        ${calculateTotalPrice(selectedOrder.products)}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />

                        <div>
                            <label className="block text-gray-600">Status</label>
                            <Select
                                value={selectedOrder.orderStatus ? "Completed" : "In progress"}
                                onChange={(value) => {
                                    setSelectedOrder({ ...selectedOrder, orderStatus: value === "Completed" })
                                }}
                                style={{ width: "100%" }}
                            >
                                <Option value="Completed">Completed</Option>
                                <Option value="In progress">In progress</Option>
                            </Select>
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleModalSave}
                        className="ant-btn ant-btn-primary px-6 py-2 rounded-md"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleModalCancel}
                        className="ant-btn ant-btn-default px-6 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default OrderHistory;
