import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';
import DatePickerOne from '../../components/Forms/DatePicker/DatePickerOne';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllShelfs } from '../../services/shelfApi';
import { getAllSuppliers } from '../../services/supplierApi';
import { createProductBySuppliers } from '../../services/productApi';
import dayjs from 'dayjs';
import { getAllUsers } from '../../services/userApi';

interface ImportProductDetails {
  sku: string;
  barcode: string;
  productName: string;
  description: string;
  basePrice: number;
  supplierId: string;
  shelfId: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  userId: string;
}

const ImportProduct: React.FC = () => {
  const [importDetails, setImportDetails] = useState<ImportProductDetails>({
    sku: '',
    barcode: '',
    productName: '',
    description: '',
    basePrice: 0,
    supplierId: '',
    shelfId: '',
    quantity: 0,
    manufactureDate: '',
    expiryDate: '',
    userId: '',
  });
  const [shelfs, setShelfs] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const featchShelfs = async () => {
      try {
        const response = await getAllShelfs();
        setShelfs(response.data.result.items);
      } catch (error) {
        toast.error('Failed to fetch shelf IDs');
      }
    };
    const featchSuppliers = async () => {
      try {
        const response = await getAllSuppliers();
        setSuppliers(response.data.result.suppliers);
      } catch (error) {
        toast.error('Failed to fetch supplier IDs');
      }
    };
    const featchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data.result);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    featchUsers();
    featchSuppliers();
    featchShelfs();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setImportDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: string, field: string) => {
    setImportDetails((prev) => ({
      ...prev,
      [field]: dayjs(date).format('YYYY-MM-DD'),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('importDetails first', importDetails);

    // Validate all required fields
    if (
      !importDetails.sku ||
      !importDetails.barcode ||
      !importDetails.productName ||
      !importDetails.description ||
      !importDetails.basePrice ||
      !importDetails.supplierId ||
      !importDetails.shelfId ||
      !importDetails.quantity ||
      !importDetails.manufactureDate ||
      !importDetails.expiryDate ||
      !importDetails.userId
    ) {
      toast.error('All fields are required.');
      return;
    }

    // Validate SKU format
    const skuPattern = /^SKU\d+$/;
    if (!skuPattern.test(importDetails.sku)) {
      toast.error(
        "SKU must be in the format 'SKUxxx', where 'xxx' are numbers.",
      );
      return;
    }
    // Validate quantity: greater than 0 and less than a max value (e.g. 10000)
    if (importDetails.quantity <= 0 || importDetails.quantity > 2147483647) {
      toast.error('Quantity must be greater than 0 and less than 2147483647.');
      return;
    }

    // Validate price: must be >= 0 and less than a max value (e.g. 99999999999999)
    if (
      importDetails.basePrice < 0 ||
      importDetails.basePrice > 99999999999999
    ) {
      toast.error(
        'Price must be greater than or equal to 0 and less than 99999999999999.',
      );
      return;
    }

    // Validate date: manufacture date and expiry date must not be in the future
    const today = new Date();
    const manufactureDate = new Date(importDetails.manufactureDate);
    const expiryDate = new Date(importDetails.expiryDate);
    if (manufactureDate > today) {
      toast.error('Manufacture date must not be in the future');
      return;
    }
    if (expiryDate < today) {
      toast.error('Expiry date must be in the future');
      return;
    }
    if (expiryDate < manufactureDate) {
      toast.error('Expiry Date must be greater than Manufacture Date');
      return;
    }

    // Convert fields to the correct types
    const requestBody = {
      ...importDetails,
      basePrice: parseFloat(importDetails.basePrice.toString()),
      quantity: parseInt(importDetails.quantity.toString(), 10),
      manufactureDate: dayjs(importDetails.manufactureDate).format(
        'YYYY-MM-DD',
      ),
      expiryDate: dayjs(importDetails.expiryDate).format('YYYY-MM-DD'),
    };

    // If all validations passed, submit form
    try {
      console.log('requestBody', requestBody);
      await createProductBySuppliers(requestBody);
      toast.success('Product imported successfully!');
    } catch (error: any) {
      toast.error(
        error.response.data.errorMessages
          ? error.response.data.errorMessages[0]
          : 'Failed to import product',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Import Product to Warehouse" />

      <div className="grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Product Information --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Import Product Information
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Chọn sản phẩm */}
              <div>
                <SelectGroupTwo
                  label="Shelf Id"
                  name="shelfId"
                  value={importDetails.shelfId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Shelf Id' },
                    ...shelfs.map((shelf) => ({
                      value: shelf.shelfId,
                      label: shelf.shelfId + ' - ' + shelf.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <SelectGroupTwo
                  label="Supplier Id"
                  name="supplierId"
                  value={importDetails.supplierId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Supplier Id' },
                    ...suppliers.map((supplier) => ({
                      value: supplier.supplierId,
                      label: supplier.supplierId + ' - ' + supplier.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <SelectGroupTwo
                  label="User Id"
                  name="userId"
                  value={importDetails.userId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Supplier Id' },
                    ...users.map((user) => ({
                      value: user.id,
                      label: user.id + ' - ' + user.email,
                    })),
                  ]}
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={importDetails.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Barcode
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={importDetails.barcode}
                  onChange={handleInputChange}
                  placeholder="Enter barcode"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={importDetails.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={importDetails.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>
              {/* Số lượng */}
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={importDetails.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              {/* Giá nhập */}
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Price
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={importDetails.basePrice}
                  onChange={handleInputChange}
                  placeholder="Enter base price"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Manufacture Date{' '}
                </label>
                <DatePickerOne
                  selectedDate={importDetails.manufactureDate}
                  onChange={(date: string) =>
                    handleDateChange(date, 'manufactureDate')
                  }
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Expiry Date{' '}
                </label>
                <DatePickerOne
                  selectedDate={importDetails.expiryDate}
                  onChange={(date: string) =>
                    handleDateChange(date, 'expiryDate')
                  }
                />
              </div>

              <div className="flex justify-center p-6.5">
                <button
                  onClick={handleSubmit}
                  className="rounded-md bg-blue-600 text-white px-6 py-3"
                >
                  Import Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportProduct;
