import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Button, Collapse, Form, Input, InputNumber, Table } from 'antd';
import { shelfColumns } from '../util/shelfColumns';
import { LAYOUT_SHELF, VALIDATE_MESSAGES } from '../validate/validateMessages';
import '../css/buttonSearch.css';
import {
  createShelfs,
  deleteShelfs,
  getShelfs,
  updateShelfs,
} from '../services/shelfApi';
import { useStyle } from '../css/useStyle';
import DeleteModal from '../components/ModalDelete';

export interface Shelf {
  shelfId: number;
  code: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createAt: string;
  updateAt: string;
  createBy: string;
}

const Shelfs: React.FC = () => {
  const { Search } = Input;
  const { styles } = useStyle();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [shelfs, setShelfs] = useState<Shelf[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [openModalDelete, setModalDelete] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [selectedShelfDelete, setSelectedShelfDelete] = useState<Shelf | null>(
    null,
  );
  const { Panel } = Collapse;

  const fetchShelfs = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getShelfs(pageNumber, pageSize);
      console.log('fetchShelfs', response.data.result.items);
      setShelfs(response.data.result.items);
      setPagination({
        current: response.data.result.currentPage,
        pageSize: response.data.result.pageSize,
        total: response.data.result.totalCount,
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchShelfs(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination: any) => {
    console.log('change paginationg', pagination);
    fetchShelfs(pagination.current, pagination.pageSize);
  };
  const handleSearch = (record: any) => {
    setSearchLoading(true);
    console.log('search shelf', record);
    setSearchLoading(false);
  };
  const handleEdit = (record: Shelf) => {
    setSelectedShelf(record);
    setOpenModal(true);
    console.log('edit shelf', record);
  };
  const handleSelectedDelete = (record: Shelf) => {
    setSelectedShelfDelete(record);
    setModalDelete(true);
  };
  const handleDelete = async () => {
    if (selectedShelfDelete) {
      try {
        const response = await deleteShelfs(selectedShelfDelete.shelfId);
        console.log(response);
        setShelfs(
          shelfs.filter(
            (shelf) => shelf.shelfId !== selectedShelfDelete.shelfId,
          ),
        );
        toast.success('Delete shelf success');
      } catch (error) {
        console.log(error);
        toast.error('Delete shelf failed');
      }
    }
    setModalDelete(false);
  };
  const handleView = (record: Shelf) => {
    console.log('view shelf', record);
  };

  const onFinish = async (values: any) => {
    console.log('value', values);
    try {
      if (selectedShelf) {
        const response = await updateShelfs(selectedShelf.shelfId, values);
        console.log(response);
        toast.success('Update shelf success');
        setShelfs(
          shelfs.map((shelf) =>
            shelf.shelfId === selectedShelf.shelfId
              ? response.data.result
              : shelf,
          ),
        );
      } else {
        const response = await createShelfs(values);
        console.log(response);
        toast.success('Create shelf success');
        setShelfs([...shelfs, response.data.result]);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        selectedShelf ? 'Update shelf failed' : 'Create shelf failed',
      );
    }
    setOpenModal(false);
    setIsEditMode(false);
    setSelectedShelf(null);
  };
  const toggleCollapse = () => {
    console.log('activeKey', activeKey);
    console.log('activeKey', activeKey.length);
    setActiveKey(activeKey.length ? [] : ['1']);
  };

  return (
    <>
      <Breadcrumb pageName="Shelfs Manage" />
      <Collapse
        activeKey={activeKey}
        onChange={toggleCollapse}
        style={{ marginBottom: '20px' }}
      >
        <Panel header="Create New Shelf" key="1">
          <div className="bg-white p-8 rounded-md w-full">
            <Form
              {...LAYOUT_SHELF}
              name="shelfs"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              validateMessages={VALIDATE_MESSAGES}
            >
              <Form.Item
                name={['code']}
                label="Code"
                rules={[
                  { required: true },
                  {
                    pattern: /^[A-Z]{2}\d+$/,
                    message:
                      'Shelf Code must start with 2 uppercase letters followed by numbers (e.g., AB123)',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['name']}
                label="Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['location']}
                label="Location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['capacity']}
                label="Capacity"
                rules={[{ type: 'number', required: true, min: 1, max: 99 }]}
              >
                <InputNumber />
              </Form.Item>
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
            </Form>
          </div>
        </Panel>
      </Collapse>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
        }}
      >
        <Search
          placeholder="Search By Code"
          enterButton="Search"
          size="large"
          loading={searchLoading}
          onSearch={handleSearch}
          className="custom-search-button"
          style={{ width: '50%' }}
        />
      </div>
      <div>
        <Table<Shelf>
          rowKey="shelfId"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          className={styles.customTable}
          onChange={handleTableChange}
          columns={shelfColumns(handleEdit, handleSelectedDelete, handleView)}
          dataSource={shelfs}
          scroll={{ x: 'max-content' }}
        />
      </div>
      {openModal && (
        <div className="fixed z-999 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-center text-2xl font-bold mb-8">Edit Shelft</h2>
            <Form
              {...LAYOUT_SHELF}
              name="shelfs"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              validateMessages={VALIDATE_MESSAGES}
              initialValues={selectedShelf || undefined}
            >
              <Form.Item
                name={['code']}
                label="Code"
                rules={[
                  { required: true },
                  {
                    pattern: /^[A-Z]{2}\d+$/,
                    message:
                      'Shelf Code must start with 2 uppercase letters followed by numbers (e.g., AB123)',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['name']}
                label="Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['location']}
                label="Location"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['capacity']}
                label="Capacity"
                rules={[{ type: 'number', required: true, min: 1, max: 99 }]}
              >
                <InputNumber />
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
        selected={selectedShelfDelete}
        type="Shelf"
      />
    </>
  );
};

export default Shelfs;
