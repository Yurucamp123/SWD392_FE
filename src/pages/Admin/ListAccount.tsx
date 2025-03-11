import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Modal, Pagination } from 'antd';
import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import * as XLSX from 'xlsx';
import { deleteAccountAction } from '../../fetch/account';

const ListAccount: React.FC = () => {
    const accountsLoad = useLoaderData()
    let accountList = []
    if (accountsLoad.statusCode === 200) {
        accountList = accountsLoad.result.map((account: { id: string; email: string; phoneNumber: string; roles: string[]; status: string; }) => ({
            id: account.id || 'N/A',
            email: account.email || 'N/A',
            phone: account.phoneNumber || 'N/A',
            role: account.roles.join(', ') || 'N/A',
            status: account.status ? 'Active' : 'Inactive',
        }))
    } else {
        toast.error("Failed to load account data")
    }

    const [accounts, setAccounts] = useState(accountList);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);  // Trang hiện tại
    const [pageSize] = useState(5);  // Số lượng item mỗi trang
    const [showModal, setShowModal] = useState(false); // To manage modal visibility
    const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);

    const navigate = useNavigate();

    // Function to filter accounts based on search term
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    const handleCancel = () => {
        setShowModal(false); // Close the modal when cancel is clicked
        setDeleteAccountId(null); // Clear the account ID
    };
    // Filter accounts by search term
    const filteredAccounts = accounts.filter((account: { id: string; email: string; phone: string; role: string; status: string }) =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredAccounts);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Accounts");
        XLSX.writeFile(wb, "accounts_data.xlsx");
        toast.success("Data exported successfully!");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedAccounts = filteredAccounts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleEdit = (id: string) => {
        navigate(`/admin/edit-account/${id}`);
    };

    const handleDelete = (id: string) => {
        setDeleteAccountId(id); // Set account ID for deletion
        setShowModal(true); // Show the modal
    };

    const deleteAccount = async (id: string | null) => {
        if (!id) {
            return;
        }
        const response = await deleteAccountAction(id)
        if (response.statusCode === 200) {
            setAccounts(accounts.filter((account:
                { id: string; email: string; phone: string; role: string; status: string }) => account.id !== id));
            setIsDeleting(null);
            toast.success("Account deleted successfully!");
            setShowModal(false);
        } else {
            toast.error("Failed to delete account. Please try again later.");
        }
    };

    return (
        <>
            <Breadcrumb pageName="Manage Account" />
            <div className="grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* Account Management */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Account list</h3>
                        </div>
                        <div className="flex flex-col gap-5.5 p-6.5">
                            {/* Search Bar */}
                            <div className="flex items-center gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by username, email, or role"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <button
                                    onClick={handleExport}
                                    className="min-w-40 bg-blue-600 text-white py-2 px-4 rounded-md"
                                >
                                    Export Data
                                </button>

                                <Link to="/admin/add-account"
                                    className="min-w-40 bg-green-600 text-white py-2 px-4 rounded-md"
                                >
                                    Create account +
                                </Link>
                            </div>

                            {/* Account Table */}
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-4">Account ID</th>
                                        <th className="px-4 py-4">Email</th>
                                        <th className="px-4 py-4">Phone Number</th>
                                        <th className="px-4 py-4">Role</th>
                                        <th className="px-4 py-4">Status</th>
                                        <th className="px-4 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAccounts.length > 0 ? (
                                        paginatedAccounts.map((account: { id: string; email: string; phone: string; role: string; status: string }) => (
                                            <tr key={account.id}>
                                                <td className="px-4 py-4 text-center">{account.id}</td>
                                                <td className="px-4 py-4 text-center">{account.email}</td>
                                                <td className="px-4 py-4 text-center">{account.phone}</td>
                                                <td className="px-4 py-4 text-center">{account.role}</td>
                                                <td className={`px-4 py-4 text-center text-${account.status === 'Active' ? 'green-600' : 'red-600'}`}>
                                                    {account.status}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <button
                                                        onClick={() => handleEdit(account.id)}
                                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                                    >
                                                        <EditOutlined />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(account.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-2">
                                                No accounts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredAccounts.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                className="mt-4 flex justify-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Are you sure you want to delete this account?"
                open={showModal}
                onOk={() => deleteAccount(deleteAccountId)}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
            >
                <p>This action cannot be undone.</p>
            </Modal>
        </>
    );
};

export default ListAccount;
