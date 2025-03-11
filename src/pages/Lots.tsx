import * as React from 'react';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from 'antd';
import { toast } from 'react-toastify';
import { lotColumns } from '../util/lotColumns';
import '../css/buttonSearch.css';
import { LAYOUT_LOT, VALIDATE_MESSAGES } from '../validate/validateMessages';
import { useStyle } from '../css/useStyle';
import {
  createLots,
  deleteLots,
  getLots,
  updateLots,
} from '../services/lotApi';
import { getAllShelfs, getShelfs } from '../services/shelfApi';
import { getAllProducts } from '../services/productApi';
import DeleteModal from '../components/ModalDelete';

export interface Lot {
  lotId: number;
  productId: number;
  shelfId: number;
  lotCode: string;
  manufactureDate: string;
  expiryDate: string;
  quantity: number;
  status: string;
  createAt: string;
  updateAt: string;
  createBy: string;
}

const Lots: React.FC = () => {
  const navigate = useNavigate();
  const { Search } = Input;
  const { Panel } = Collapse;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [shelfs, setShelfs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { styles } = useStyle();
  const dateFormat = 'DD-MM-YYYY';
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 10 ,total: 0, });
  const [selectedLotDelete, setSelectedLotDelete] = useState<Lot | null>(null);
  const [openModalDelete, setModalDelete] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  console.log('selectedLot', selectedLot);
  
  useEffect(() => {
    fecthLots(pagination.pageNumber, pagination.pageSize);
    const fetchShelfIds = async () => {
      try {
        const response = await getAllShelfs();
        setShelfs(response.data.result.items);
      } catch (error) {
        toast.error('Failed to fetch shelf IDs');
      }
    };
    const fetchProductIds = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.result.products);
      } catch (error) {
        toast.error('Failed to fetch product IDs');
      }
    };
    fetchShelfIds();
    fetchProductIds();
  }, []);
  const fecthLots = async (pageNumber: number, pageSize: number) => {
    try {
      const response = await getLots(pageNumber, pageSize);
      setPagination({
        pageNumber: response.data.result.currentPage,
        pageSize: response.data.result.pageSize,
        total: response.data.result.totalCount,
      });
      //console.log('fecthlots', fetchLots);
      setLots(response.data.result.lots);
    } catch (error) {
      toast.error('Failed to fetch lots');
    }
  };
  const handleTalbeChange = (pagination: any) => {
    fecthLots(pagination.current, pagination.pageSize);
  };
  const handleSearch = (record: any) => {
    setSearchLoading(true);
    console.log('search Lot', record);
    setSearchLoading(false);
  };
  const handleEdit = (record: Lot) => {
    setSelectedLot(record);
    setOpenModal(true);
    console.log('edit lot', record);
  };
  const handleSelectedDelete = (record: Lot) => {
    setSelectedLotDelete(record);
    setModalDelete(true);
  };
  const handleDelete = async () => {
    if (selectedLotDelete) {
      try {
        const response = await deleteLots(selectedLotDelete.lotId);
        console.log(response);
        setLots(lots.filter((lot) => lot.lotId !== selectedLotDelete.lotId));
        toast.success('Delete Lot success');
      } catch (error) {
        console.log(error);
        toast.error('Delete Lot failed');
      }
    }
    setModalDelete(false);
  };
  const handleView = (record: Lot) => {
    console.log('view Lot', record);
  };


  const onFinish = async (values: any) => {
    console.log('value', values);
    try {
      if (selectedLot) {
        const response = await updateLots(selectedLot.lotId, values);
        console.log(response);
        toast.success('Update Lot success');
        setLots(
          lots.map((lot) =>
            lot.lotId === selectedLot.lotId ? response.data.result : lot,
          ),
        );
      } else {
        const response = await createLots(values);
        console.log(response);
        toast.success('Create Lot success');
        setLots([...lots, response.data.result]);
      }
    } catch (error) {
      console.log(error);
      toast.error(selectedLot ? 'Update Lot failed' : 'Create Lot failed');
    }
    setOpenModal(false);
    setIsEditMode(false);
    setSelectedLot(null);
  };
  const toggleCollapse = () => {
    console.log('activeKey', activeKey);
    console.log('activeKey', activeKey.length);
    setActiveKey(activeKey.length ? [] : ['1']);
  };
  return (
    <>
      <Breadcrumb pageName="Lots" />
      <Collapse
        activeKey={activeKey}
        onChange={toggleCollapse}
        style={{ marginBottom: '20px' }}
      >
        <Panel header="Create New Lot" key="1">
          <div className="bg-white p-8 rounded-md w-full">
            <Form
              {...LAYOUT_LOT}
              name="lots"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              validateMessages={VALIDATE_MESSAGES}
            >
              <Form.Item
                name={['lotCode']}
                label="Lot Code"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['shelfId']}
                label="Shelf ID"
                rules={[{ required: true }]}
              >
                <Select>
                  {shelfs.map((item) => (
                    <Select.Option key={item.shelfId} value={item.shelfId}>
                      {item.shelfId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['productId']}
                label="Product ID"
                rules={[{ required: true }]}
              >
                <Select>
                  {products.map((item) => (
                    <Select.Option key={item.productId} value={item.productId}>
                      {item.productId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name={['managefactureDate']}
                label="Managefacture Date"
                rules={[{ required: true, type: 'object' }]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>
              <Form.Item
                name={['expiryDate']}
                label="Expiry Date"
                rules={[{ required: true, type: 'object' }]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>
              <Form.Item
                name={['quantity']}
                label="Quantity"
                rules={[{ type: 'number', required: true, min: 0, max: 200 }]}
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
          placeholder="Search by Code, BUG UPDATE, DON'T HAVE DELETE"
          enterButton="Search"
          size="large"
          loading={searchLoading}
          onSearch={handleSearch}
          className="custom-search-button"
          style={{ width: '50%' }}
        />
      </div>
      <div>
        <Table<Lot>
          className={styles.customTable}
          rowKey="lotId"
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTalbeChange}
          columns={lotColumns(handleEdit, handleSelectedDelete, handleView)}
          dataSource={lots}
          scroll={{ x: 'max-content' }}
        />
      </div>
      {openModal && (
        <div className="fixed z-999 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-center text-2xl font-bold mb-8">Edit Lot</h2>
            <Form
              {...LAYOUT_LOT}
              name="lots"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              validateMessages={VALIDATE_MESSAGES}
              initialValues={selectedLot || undefined}
            >
              <Form.Item
                name={['lotCode']}
                label="Lot Code"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={['shelfId']}
                label="Shelf ID"
                rules={[{ required: true }]}
              >
                <Select>
                  {shelfs.map((item) => (
                    <Select.Option key={item.shelfId} value={item.shelfId}>
                      {item.shelfId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['productId']}
                label="Product ID"
                rules={[{ required: true }]}
              >
                <Select>
                  {products.map((item) => (
                    <Select.Option key={item.productId} value={item.productId}>
                      {item.productId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* <Form.Item
                name={['managefactureDate']}
                label="Managefacture Date"
                //rules={[{ required: true, type: 'object' }]}
              >
                <span>{selectedLot?.manufactureDate}</span>
              </Form.Item>
              <Form.Item
                name={['expiryDate']}
                label="Expiry Date"
                // rules={[{ required: true, type: 'object' }]}
              >
                  <span>{selectedLot?.expiryDate}</span>
              </Form.Item> */}
              {/* <Form.Item
                name={['createdAt']}
                label="Created At"
                // rules={[{ required: true, type: 'object' }]}
              >
                  <span>{selectedLot?.expiryDate}</span>
              </Form.Item>
              <Form.Item
                name={['updatedAt']}
                label="updated At"
                // rules={[{ required: true, type: 'object' }]}
              >
                  <span>{selectedLot?.expiryDate}</span>
              </Form.Item> */}
              <Form.Item
                name={['quantity']}
                label="Quantity"
                rules={[{ type: 'number', required: true, min: 0, max: 200 }]}
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
        selected={selectedLotDelete}
        type="Lot"
      />
    </>
  );
};

export default Lots;
