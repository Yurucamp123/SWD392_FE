import React, { useActionState } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; // For displaying error messages
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { updateAccountAction } from "../../fetch/account";
import { validateNonEmptyString, validatePhoneNumber } from "../../util/validation";

// Account creation form validation rules
const validateAccountData = (accountData: any) => {
    const { phoneNumber, roles, status } = accountData;
    if ((phoneNumber && !validateNonEmptyString(phoneNumber) || !phoneNumber)) {
        return "Phone is required.";
    }

    if (!validateNonEmptyString(status)) {
        return "Status is required.";
    }

    if (roles.length === 0) {
        return "Please select at least one role.";
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return "Please enter a valid phone number.";
    }

    return null; // No errors
};

const EditAccount: React.FC = () => {
    const { id } = useParams(); // Extract account ID from the URL
    const navigate = useNavigate();
    let accountDetails = {
        email: "",
        phoneNumber: "",
        roles: [""],
        status: "",
    }

    const responseAccount = useLoaderData()
    if (responseAccount.statusCode === 200) {
        const currentAccount = responseAccount.result.find
            ((account: {
                id: string; email: string;
                phoneNumber: string; roles: string[]; status: string;
            }) =>
                account.id === id)

        if (currentAccount) {
            accountDetails = {
                ...currentAccount,
                status: currentAccount.status ? "Active" : "Inactive"
            }
        }
    }

    // Handle form submission
    const handleSubmit = async (_prevState: any, formData: any): Promise<any> => {
        const data = {
            email: formData.get("email") || accountDetails.email || "",
            phoneNumber: formData.get("phoneNumber"),
            roles: formData.getAll("roles"),
            status: formData.get("status"),
        }

        // Validate the account data
        const validationError = validateAccountData(data);
        if (validationError) {
            toast.error(validationError);
            return { ...data };
        }

        try {
            const submitData = {
                ...data,
                status: data.status === 'Active' ? true : false
            }
            const responseUpdate = await updateAccountAction(id, submitData);
            if (responseUpdate.statusCode === 200) {
                navigate("/admin/accounts");
                toast.success("Account updated successfully!");
            } else {
                toast.error(responseUpdate[0].toString());
                return { ...data };
            }
        } catch (error) {
            toast.error("Failed to update account.");
            return { ...data };
        }
    };

    const [formState, formAction, pending] = useActionState(handleSubmit, { ...accountDetails });

    return (
        <>
            <Breadcrumb pageName="Edit Account" />
            <div className="grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">
                    {/* Edit Account Form */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Edit Account</h3>
                        </div>
                        <form action={formAction}>
                            <div className="flex flex-col gap-5.5 p-6.5">
                                {/* Email */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Email</label>
                                    <input
                                        disabled
                                        defaultValue={formState?.email}
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Phone Number</label>
                                    <input
                                        defaultValue={formState?.phoneNumber}
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Enter phone number"
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

                                {/* Status */}
                                <div>
                                    <label className="mb-3 block text-black dark:text-white">Status</label>
                                    <select
                                        defaultValue={formState?.status}
                                        name="status"
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center p-6.5">
                                    <button
                                        disabled={pending}
                                        type="submit"
                                        className="rounded-md bg-blue-600 text-white px-6 py-3"
                                    >
                                        {pending ? 'Updating account...' : 'Update Account'}
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
        </>
    );
};

export default EditAccount;
