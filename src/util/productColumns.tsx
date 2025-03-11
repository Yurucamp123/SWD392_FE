// src/columns/shelfColumns.ts
import { Space, TableColumnsType, TableProps, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { Product } from '../pages/Products';
import { adjustTimezone } from './convertUtils';

export const productColumns = (
  handleEdit: (record: Product) => void,
  handleSelectedDelete: (record: Product) => void,
  handleView: (record: Product) => void,
): TableColumnsType<Product> => [
  {
    title: 'Product Id',
    dataIndex: 'productId',
    key: 'productId',
    render: (text) => <a>{text}</a>,
    fixed: 'left',
    sorter: (a, b) => a.productId - b.productId,
    defaultSortOrder: 'descend',
    sortDirections: ['descend', 'ascend'],

  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    fixed: 'left',
  },
  {
    title: 'BarCode',
    dataIndex: 'barcode',
    key: 'barCode',
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'productName',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Base Price',
    dataIndex: 'basePrice',
    key: 'basePrice',
    sorter: (a, b) => a.basePrice - b.basePrice,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Create At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text) => <div className="text-green-700">{adjustTimezone(text, 7)}</div>,
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Update At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (text) => <div className="text-red">{adjustTimezone(text, 7)}</div>,
    sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'User Name',
    dataIndex: 'userName',
    key: 'userName',
    render: (text) => <div className="text-blue-600">{text}</div>,
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, record: Product) => (
      <Space size="middle">
        <EditOutlined
          onClick={() => handleEdit(record)}
          style={{ fontSize: 18, color: '#1890ff', cursor: 'pointer' }}
        />
        <DeleteOutlined
          onClick={() => handleSelectedDelete(record)}
          style={{ fontSize: 18, color: '#ff4d4f', cursor: 'pointer' }}
        />
        <ZoomInOutlined
          onClick={() => handleView(record)}
          style={{ fontSize: 18, color: '#52c41a', cursor: 'pointer' }}
        />
      </Space>
    ),
  },
];
