import { Modal } from "antd";
import React, { useActionState, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // For displaying error messages
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { createAccountAction } from "../../fetch/account";
import { validateEmail, validateNonEmptyString, validatePassword } from "../../util/validation";

// Account creation form validation rules
const validateAccountData = (accountData: any) => {
    const { email, password, roles } = accountData;

    if (!validateNonEmptyString(email)) {
        return "Email is required."
    }

    if (!validateNonEmptyString(password)) {
        return "Password is required.";
    }

    if (roles.length === 0) {
        return "Please select at least one role.";
    }

    if (!validateEmail(email)) {
        return "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
        return "Password must contain at least 6 characters, 1 capital letter, 1 number, and 1 special character.";
    }

    return null; // No errors
};

const AddAccount: React.FC = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false); // To handle modal visibility
    const [accountDetails, setAccountDetails] = useState({ email: '', password: '', roles: [] });
    // Handle form submission
    const handleSubmit = async (_prevState: any, formData: any): Promise<any> => {
        const email = formData.get("email");
        const password = formData.get("password");
        const roles = formData.getAll("roles");

        // Validate the account data
        const validationError = validateAccountData({
            email,
            roles,
            password,
        });
        if (validationError) {
            toast.error(validationError);
            return {
                email, password, roles
            }
        }

        try {
            const data = {
                username: email,
                roles,
                password,
            }
            const response = await createAccountAction(data);
            if (response.statusCode === 200) {
                setAccountDetails({ email, password, roles });
                setIsModalVisible(true);
            } else {
                toast.error(response[0].toString());
                return {
                    email, password, roles
                }
            }
        } catch (error) {
            toast.error("Failed to create account.");
        }
    };

    const handleCopy = () => {
        const text = `Email: ${accountDetails.email}\nPassword: ${accountDetails.password}`;
        navigator.clipboard.writeText(text); // Copy to clipboard
        toast.success("Credentials copied to clipboard!");
    };

    const [formState, formAction, pending] = useActionState(handleSubmit, {
        email: "",
        roles: "",
        password: "",
    })

    return (
        <>
            <Breadcrumb pageName="Add New Account" />

            <div className="grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* Add New Account Form */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Create New Account</h3>
                        </div>
                        <form action={formAction}>
                            <div className="flex flex-col gap-5.5 p-6.5">
                                {/* Email */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Email</label>
                                    <input
                                        defaultValue={formState?.email}
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    />
                                </div>
                                {/* Role */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Role</label>
                                    <div className="flex flex-col space-y-2">
                                        <label className="flex items-center ml-6">
                                            <input
                                                defaultChecked={formState?.roles.includes("Admin")}
                                                name="roles"
                                                type="checkbox"
                                                value="Admin"
                                                className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                            />
                                            Admin
                                        </label>
                                        <label className="flex items-center ml-6">
                                            <input
                                                defaultChecked={formState?.roles.includes("Staff")}
                                                name="roles"
                                                type="checkbox"
                                                value="Staff"
                                                className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                            />
                                            Staff
                                        </label>
                                        <label className="flex items-center ml-6">
                                            <input
                                                defaultChecked={formState?.roles.includes("Manager")}
                                                name="roles"
                                                type="checkbox"
                                                value="Manager"
                                                className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                            />
                                            Manager
                                        </label>
                                    </div>
                                </div>

                                {/* Pass */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Password</label>
                                    <input
                                        defaultValue={formState?.password}
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center p-6.5">
                                    <button
                                        disabled={pending}
                                        type="submit"
                                        className="rounded-md bg-blue-600 text-white px-6 py-3"
                                    >
                                        {pending ? 'Creating account...' : 'Create Account'}
                                    </button>

                                    <Link
                                        to="/admin/accounts"
                                        className="rounded-md bg-white text-black-0 px-6 py-3 ml-5 border border-black hover:border-gray-600"
                                    >
                                        Back to account list
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal to show account credentials */}
            <Modal
                title="Account Created Successfully! Make sure you store this account before you close this modal"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                style={{ padding: "20px", borderRadius: "10px" }}
            >
                <p className="mt-4"><strong>Email:</strong> {accountDetails.email}</p>
                <p><strong>Password:</strong> {accountDetails.password}</p>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="ant-btn ant-btn-primary px-6 py-2 rounded-md"
                        style={{
                            backgroundColor: "#1890ff", // Ensure visibility with a solid color
                            borderColor: "#1890ff", // Make border color same as background
                            color: "white", // Ensure visibility with white text color
                        }}
                    >
                        Copy account
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsModalVisible(false)}
                        className="ant-btn ant-btn-default px-6 py-2 rounded-md border border-gray-300 ml-4"
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default AddAccount;
