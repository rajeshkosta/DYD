import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { Check, XCircle, Filter, Trash, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { orderService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const OrderList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReasonForm] = Form.useForm();
    const [selectedBooking, setSelectedBooking] = useState<{ id: string } | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const { orders, loading } = useSelector((state: RootState) => state.booking);

    console.log("order", orders);

    useEffect(() => {
        dispatch(fetchOrders() as any);
    }, [dispatch]);

    const sortedBookings = [...orders].sort((a, b) => {
        const order: { pending: number; dispatched: number; cancelled: number } = {
            pending: 1,
            dispatched: 2,
            cancelled: 3,
        };
        return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    });


    const filteredBookings = filterStatus === 'all' ? sortedBookings : sortedBookings.filter(b => b.status === filterStatus);

    const columns = [
        { title: 'Name', dataIndex: 'productName', key: 'productName' },
        { title: 'Order id', dataIndex: 'orderId', key: 'orderId' },

        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <span className={`px-2 py-1 capitalize rounded ${status === 'pending' ? 'bg-yellow-100 text-yellow-700' : status === 'dispatched' ? 'bg-blue-100 text-blue-700' : status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status.toLowerCase()}</span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="text" icon={<Eye size={16} />} style={{ color: 'green' }} onClick={() => handleView(record)} />
                    {record.status === 'pending' ? (
                        <>
                            <Button type="text" icon={<Check size={16} style={{ color: 'green' }} />}
                                onClick={() => handleApprove(record.id)}

                            > Dispatch</Button>
                            <Button type="text" danger icon={<XCircle size={16} />} onClick={() => handleRejectClick(record)}>
                                Cancal
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button type="text" danger icon={<Trash size={16} />}
                                onClick={() => handleDeleteClick(record.id)}
                            ></Button>
                            
                        </>
                    )}

                    {record.status === 'dispatched' && (
                        <Button type="text"   onClick={() => handleDelivered(record.id)}>
                            Delivered
                        </Button>
                    )}

                    {/* {record.status === 'dispatched' && (
                        <Button type="text" danger icon={<XCircle size={16} />} onClick={() => handleRejectClick(record)}>
                            cancel
                        </Button>
                    ) } */}
                </Space>
            ),
        },
    ];

    const handleApprove = async (orderId: string) => {
        const hideLoading = message.loading('Approving...', 0);
        try {
            const response = await orderService.updateStatus(orderId, "dispatched", "");
            if (response.message) {
                message.success(response.message);
            }
            dispatch(fetchOrders() as any);
            hideLoading();
        } catch (error) {
            hideLoading();
            message.error('Failed to approve booking. Please try again.');
        }
    };

    const handleRejectClick = (order: any) => {
        // console.log("booking", booking);

        setSelectedBooking(order);
        setIsRejectModalVisible(true);
    };

    const handleReject = async (values: { reason: string }) => {
        if (!selectedBooking) return;

        try {
            const response = await orderService.updateStatus(selectedBooking.id, "cancelled", values.reason);
            if (response.message) {
                message.success(response.message);
            }
            setIsRejectModalVisible(false);
            dispatch(fetchOrders() as any);
        } catch (error) {
            console.error("Error rejecting booking:", error);
        }
    };

    const handleDelivered = async (orderId: string) => {
        const hideLoading = message.loading('updating status...', 0);
        try {
            const response = await orderService.updateStatus(orderId, "delivered", "");
            if (response.message) {
                message.success(response.message);
            }
            dispatch(fetchOrders() as any);
            hideLoading();
        } catch (error) {
            hideLoading();
            message.error('Failed to deliver booking. Please try again.');
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const handleDeleteClick = (orderId: string) => {
        setIsModalVisible(true);
        setSelectedId(orderId);
    }

    const handleDeleteConfirm = async () => {
        if (selectedId) {
            const hideLoading = message.loading('Deleting...', 0);
            try {
                const response = await orderService.deleteBooking(selectedId);
                if (response && response.message) {
                    message.success(response.message);
                } else {
                    message.success('Product deleted successfully');
                }
                dispatch(fetchOrders() as any);
                setIsModalVisible(false);
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    message.error(error.response.data.message);
                } else {
                    message.error('Failed to delete product. Please try again.');
                }
            } finally {
                hideLoading();
                setIsModalVisible(false);
                setSelectedId(null);
            }
        }
    };

    const handleView = (booking: any) => {
        navigate(`/dashboard/bookingDetails`, { state: { booking } });
    }


    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Bookings</h1>
                <Select value={filterStatus} onChange={setFilterStatus} className="w-40">
                    <Filter size={16} />
                    <Option value="all">All</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="dispatched">dispatched</Option>
                    <Option value="cancelled">cancelled</Option>
                </Select>
            </div>
            <Table
                columns={columns}
                loading={loading}
                dataSource={filteredBookings}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Cancal order"
                open={isRejectModalVisible}
                onCancel={() => setIsRejectModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" form={rejectReasonForm} onFinish={handleReject}>
                    <Form.Item label="Reason for cancellation" name="reason" rules={[{ required: true, message: 'Please provide a reason!' }]}>
                        <Input.TextArea rows={4} placeholder="Enter reason..." />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={() => setIsRejectModalVisible(false)} style={{ marginRight: 8 }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" danger>Cancal order</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Confirm Deletion"
                // visible={isModalVisible}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleDeleteConfirm}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}>
                <p>Are you sure you want to delete this booking?</p>
            </Modal>
        </div>
    );
};

export default OrderList;