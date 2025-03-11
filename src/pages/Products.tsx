import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LAYOUT_LOT, VALIDATE_MESSAGES } from '../validate/validateMessages';
import { productColumns } from '../util/productColumns';
import {
  createProducts,
  deleteProducts,
  getProducts,
  searchProducts,
  updateProducts,
} from '../services/productApi';
import { useStyle } from '../css/useStyle';
import DeleteModal from '../components/ModalDelete';
import { getAllShelfs } from '../services/shelfApi';
import { getAllLots } from '../services/lotApi';

export interface Product {
  productId: number;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  basePrice: number;
  createAt: string;
  updateAt: string;
  createById: string;
}

const Products = () => {
  const navigate = useNavigate();
  const { Search } = Input;
  const { Panel } = Collapse;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { styles } = useStyle();
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    total: 0,
  });
  const [openModalDelete, setModalDelete] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductDelete, setSelectedProductDelete] =
    useState<Product | null>(null);
  const [shelfs, setShelfs] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const fetchProducts = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getProducts(pageNumber, pageSize);
      console.log('response', response.data);

      setProducts(response.data.result.products);
      setPagination({
        pageNumber: response.data.result.currentPage,
        pageSize: response.data.result.pageSize,
        total: response.data.result.totalCount,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts(pagination.pageNumber, pagination.pageSize);
  }, []);

  const handleTalbeChange = (pagination: any) => {
    console.log('pagination', pagination);

    fetchProducts(pagination.current, pagination.pageSize);
  };

  const handleSearch = async (record: any) => {
    setSearchLoading(true);
    try {
      const response = await searchProducts(record);
      setProducts(response.data.result);
      setSearchLoading(false);
    } catch (error) {
      toast.error('Search Product failed');
      setSearchLoading(false);
    }
  };

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setOpenModal(true);
    console.log('edit Product', record);
  };

  const handleSelectedDelete = (record: Product) => {
    setSelectedProductDelete(record);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    if (selectedProductDelete) {
      try {
        const response = await deleteProducts(selectedProductDelete.productId);
        console.log(response);
        setProducts(
          products.filter(
            (product) => product.productId !== selectedProductDelete.productId,
          ),
        );
        toast.success('Delete Product success');
      } catch (error) {
        console.log(error);
        toast.error('Delete Product failed');
      }
    }
    setModalDelete(false);
  };

  const handleView = (record: Product) => {
    console.log('view Product', record);
  };

  const onFinish = async (values: any) => {
    console.log('value', values);
    try {
      if (selectedProduct) {
        const response = await updateProducts(
          selectedProduct.productId,
          values,
        );
        console.log(response);
        toast.success('Update Product success');
        setProducts(
          products.map((product) =>
            product.productId === selectedProduct.productId
              ? response.data.result
              : product,
          ),
        );
      } else {
        const response = await createProducts(values);
        console.log(response);
        toast.success('Create Product success');
        setProducts([...products, response.data.result]);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        selectedProduct ? 'Update Product failed' : 'Create Product failed',
      );
    }
    setOpenModal(false);
    setIsEditMode(false);
    setSelectedProduct(null);
  };

  const toggleCollapse = () => {
    console.log('activeKey', activeKey);
    console.log('activeKey', activeKey.length);
    setActiveKey(activeKey.length ? [] : ['1']);
  };

  return (
    <>
      <Breadcrumb pageName="Product Manage" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
        }}
      >
        <Search
          placeholder="Search by SKU"
          enterButton="Search"
          size="large"
          loading={searchLoading}
          onSearch={handleSearch}
          className="custom-search-button"
          style={{ width: '50%' }}
        />
      </div>
      <Table<Product>
        className={styles.customTable}
        rowKey="productId"
        pagination={{
          current: pagination.pageNumber,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={handleTalbeChange}
        columns={productColumns(handleEdit, handleSelectedDelete, handleView)}
        dataSource={products}
        scroll={{ x: 'max-content' }}
      />
      {openModal && (
        <div className="fixed z-999 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-center text-2xl font-bold mb-8">
              Edit Product
            </h2>
            <Form
              {...LAYOUT_LOT}
              name="products"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              validateMessages={VALIDATE_MESSAGES}
              initialValues={selectedProduct || undefined}
            >
              <Form.Item
                name={['sku']}
                label="SKU"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['barcode']}
                label="BarCode"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['productName']}
                label="Product Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['description']}
                label="Description"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['basePrice']}
                label="Base Price"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} step={0.01} />
              </Form.Item>
              <div className="flex justify-center">
                <Form.Item label={null}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff',
                      color: '#fff',
                      marginRight: '20px',
                    }}
                  >
                    Submit
                  </Button>
                </Form.Item>
                <Form.Item label={null}>
                  <Button
                    type="primary"
                    onClick={() => setOpenModal(false)}
                    style={{
                      backgroundColor: 'red',
                      borderColor: 'red',
                      color: '#fff',
                    }}
                    htmlType="button"
                  >
                    Close
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      )}
      <DeleteModal
        open={openModalDelete}
        onClose={() => setModalDelete(false)}
        onDelete={handleDelete}
        selected={selectedProductDelete}
        type="Product"
      />
    </>
  );
};

export default Products;
