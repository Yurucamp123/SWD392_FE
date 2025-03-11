// src/columns/shelfColumns.ts

import { Space, TableColumnsType, TableProps, Tag } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { Lot } from '../pages/Lots';
import { adjustTimezone } from './convertUtils';

export const lotColumns = (
  handleEdit: (record: Lot) => void,
  handleSelectedDelete: (record: Lot) => void,
  handleView: (record: Lot) => void,
): TableColumnsType<Lot> => [
  { title: 'Id', dataIndex: 'lotId', key: 'lotId', fixed: 'left',
    sorter: (a, b) => a.lotId - b.lotId,
    defaultSortOrder: 'descend',
    sortDirections: ['descend', 'ascend'],
   },
  {
    title: 'Product Id',
    dataIndex: 'productId',
    key: 'productId',
    fixed: 'left',
  },
  {
    title: 'Shelf Id',
    dataIndex: 'shelfId',
    key: 'shelfId',
    fixed: 'left',
  },
  {
    title: 'Create By',
    dataIndex: 'userName',
    key: 'userName',
    fixed: 'left',
    render: (text) => <div className="text-blue-600">{text}</div>,
  },
  {
    title: 'Lot Code',
    dataIndex: 'lotCode',
    key: 'lotCode',
  },
  {
    title: 'Manafacture Date',
    dataIndex: 'manufactureDate',
    key: 'manufactureDate',
    render: (text) => <div className="text-green-800">{new Date(text).toLocaleDateString()}</div>,
    sorter: (a, b) => new Date(a.manufactureDate).getTime() - new Date(b.manufactureDate).getTime(),
  },
  {
    title: 'Expiry Date',
    dataIndex: 'expiryDate',
    key: 'expiryDate',
    render: (text) => <div className="text-red">{adjustTimezone(text, 7)}</div>,
    sorter: (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    sorter: (a, b) => a.quantity - b.quantity,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, record: Lot) => (
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
