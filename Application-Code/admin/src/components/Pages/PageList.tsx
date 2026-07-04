import React from 'react';
import { Table, Button, Space, message, Modal, } from 'antd';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { fetchPages } from '../../store/slices/pageSlice';
import { useDispatch } from 'react-redux';
import { pageService } from '../../services/api';
import { useState } from 'react';


const PageList: React.FC = () => {
  const navigate = useNavigate();
  const { pages, loading } = useSelector((state: RootState) => state.pages);
  // console.log("pages", pages);


  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPages() as any);
  }, [dispatch]);


  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },

    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} />} onClick={() => handleEditPage(record)} />
          <Button type="text" danger icon={<Trash2 size={16} />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleEditPage = (record: any) => {
    navigate(`/dashboard/pagesForm`, { state: { page: record } });
  };

  const handleCreatePage = () => {
    navigate('/dashboard/pagesForm');
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [setectedPageId, setSetectedPageId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (setectedPageId) {
      const hideLoading = message.loading('deleting...', 0);
      try {
        const response = await pageService.deletePage(setectedPageId);
        if (response && response.message) {
          message.success(response.message); // Show success message
        } else {
          message.success('User deleted successfully');
        }
        dispatch(fetchPages() as any);
        setIsModalVisible(false);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
          message.error(error.response.data.message); // Show backend error message
        } else {
          message.error('Failed to delete property. Please try again.');
        }
      } finally {
        hideLoading();
        setIsModalVisible(false);
        setSetectedPageId(null);
      }
    }
  };

  const handleDelete = (pageId: string) => {
    setSetectedPageId(pageId);
    setIsModalVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Button type="primary" icon={<Plus size={16} />} onClick={handleCreatePage}>
          Create Page
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pages}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleDeleteConfirm}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}

      >
        <p>Are you sure you want to delete this page ?</p>
      </Modal>

    </div>
  );
};

export default PageList;