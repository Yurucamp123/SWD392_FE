import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

interface ModalDeleteProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    selected: any;
    type: string;
}
const DeleteModal: React.FC<ModalDeleteProps> 
= ({ open, onClose, onDelete, selected,type }) => {
  const getDisplayValue = () => {
    switch (type) {
      case 'Shelf':
        return selected?.code;
      case 'Lot':
        return selected?.lotId;
      case 'Product':
        return selected?.productId;
      default:
        return '';
    }
  };
    return (
        <Modal
          open={open}
          title={`Delete ${type}`}
          onCancel={onClose}
          footer={null}
        >
          <h2 className="text-center text-2xl font-bold mb-8">
            Are you sure to delete {type} {getDisplayValue()}?
            

          </h2>
          <div className="flex justify-center">


            <Button
              type="primary"
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: '#fff',
                marginRight: '20px',
              }}
              onClick={onClose}
            >
                <CloseOutlined />

            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: 'red',
                borderColor: 'red',
                color: '#fff',
            }}
              onClick={onDelete}
            >
            <CheckOutlined />

            </Button>
          </div>
        </Modal>
      );
}
export default DeleteModal;