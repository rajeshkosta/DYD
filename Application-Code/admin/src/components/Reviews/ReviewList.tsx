import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Space, App, Modal, message } from 'antd';
import { Trash, Eye } from 'lucide-react';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store/store';
import { fetchReviews } from '../../store/slices/reviewSlice';
import { mediaAndReviewService } from '../../services/api';


const ReviewList: React.FC = () => {
  const { reviews = [], loading } = useSelector((state: RootState) => state.reviews);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // console.log("function called");

    dispatch(fetchReviews());
  }, [dispatch]);

  const columns = [
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `${rating} ⭐`,
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
      render: (text: string) => text.length > 30 ? `${text.substring(0, 30)}...` : text,
    },
    {
      title: 'Resort Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>

          <Button type="text" icon={<Trash size={16} />} className="text-red-600 hover:text-red-800" onClick={() => handleDelete(record.id)} />
          <Button
            type="text"
            icon={<Eye size={16} />}
            style={{ color: 'green' }}
            onClick={() => handleNavigate(record)}
          />
        </Space>
      ),
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);


  const handleDeleteConfirm = async () => {
    if (selectedReviewId) {
      const hideLoading = message.loading('deleting...', 0);
      try {
        const response = await mediaAndReviewService.deleteReview(selectedReviewId);
        if (response && response.message) {
          message.success(response.message); // Show success message
        } else {
          message.success('User deleted successfully');
        }
        dispatch(fetchReviews());
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
        setSelectedReviewId(null);
      }
    }
  };

  const handleDelete = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsModalVisible(true);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [reviewDetails, setReviewDetails] = useState<any>(null);
  // console.log("reviewDetails", reviewDetails);
  

  const handleNavigate = (review: any) => {
    setShowDetails(true);
    setReviewDetails(review);

  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reviews</h1>
      </div>
      <Table
        columns={columns}
        dataSource={reviews}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: reviews.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reviews`,
        }}
        scroll={{ x: true }}
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
        <p>Are you sure you want to delete this review?</p>
      </Modal>

      <Modal
        title="Review Details"
        visible={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
      >
        <p>{reviewDetails?.review}</p>
      </Modal>
    </div>
  );
};

export default ReviewList;
