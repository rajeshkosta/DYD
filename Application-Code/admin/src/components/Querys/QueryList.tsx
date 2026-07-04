import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Modal, message, Form } from 'antd';
import { Eye, Search, Mail, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchQueries } from '../../store/slices/querySlice';
import { queryService, userService } from '../../services/api';


interface Query {
    id: string;
    name: string;
    email: string;
    message: string;
}

const QueryList: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();

    const { queries, loading } = useSelector((state: RootState) => state.queries);
    const [emailForm] = Form.useForm();

    // console.log("queries", queries);


    const [filters, setFilters] = useState({
        search: '',
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

    useEffect(() => {
        dispatch(fetchQueries());
    }, [dispatch]);

    const handleSearch = (value: string) => {
        setFilters({ ...filters, search: value.toLowerCase() });
    };

    const handleViewDetails = (record: Query) => {
        setSelectedQuery(record);
        setIsModalVisible(true);
    };



    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (text: string) => text.length > 30 ? text.slice(0, 30) + '...' : text,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Query) => (
                <Space>
                    <Button
                        type="text"
                        icon={<Eye size={16} />}
                        style={{ color: 'green' }}
                        onClick={() => handleViewDetails(record)}
                    />
                    <Button type="text" icon={<Trash size={16} />} className="text-red-600 hover:text-red-800"
                        onClick={() => showDeleteConfirm(record.id)} />
                    <Button
                        type="text"
                        icon={<Mail size={16} />}
                        style={{ color: 'blue' }}
                        onClick={() => handleEmailClick(record.email)}
                    />
                </Space>
            ),
        },
    ];

    const filteredQueries = queries.filter((query) =>
        query.name.toLowerCase().includes(filters.search) ||
        query.email.toLowerCase().includes(filters.search) ||
        query.message.toLowerCase().includes(filters.search)
    );


    // email send
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    // const [recipient, setRecipient] = useState('');



    const handleEmailClick = (email: string) => {
        emailForm.resetFields();
        emailForm.setFieldsValue({
            recipient: email,
            subject: '',
            content: '',
        })
        setIsEmailModalVisible(true);
    };

    const handleSendEmail = async (values: { subject: string, content: string, recipient: string }) => {
        const hideLoading = message.loading('Sending email...', 0);
        try {
            const response = await userService.sendEmail({
                recipients: [values.recipient],
                subject: values.subject,
                content: values.content,
            });

            hideLoading();

            if (response && response.message) {
                message.success(response.message);
            } else {
                message.success('Email sent successfully');
            }
            emailForm.resetFields();
            setIsEmailModalVisible(false); // Close the modal after success
        } catch (error: any) {
            hideLoading();
            console.error('Failed to send email:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);  // Show backend error message
            } else {
                message.error('An error occurred while sending the email.');
            }

        }
    };

    const [queryToDelete, setQueryToDelete] = useState<string | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const showDeleteConfirm = (userId: string) => {
        setQueryToDelete(userId);
        setDeleteModalVisible(true); // Show confirmation modal
    };

    const handleDeleteConfirm = async () => {
        if (queryToDelete) {
            const hideLoading = message.loading('deleting...', 0);
            try {
                const response = await queryService.deleteQuery(queryToDelete);
                if (response && response.message) {
                    message.success(response.message); // Show success message
                } else {
                    message.success('User deleted successfully');
                }
                dispatch(fetchQueries());
                setDeleteModalVisible(false);
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    message.error(error.response.data.message); // Show backend error message
                } else {
                    message.error('Failed to delete property. Please try again.');
                }
            } finally {
                hideLoading();
                setIsModalVisible(false);
                setQueryToDelete(null);
            }
        }
    };



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Query Management</h1>

                <div>
                    <Input
                        placeholder="Search queries..."
                        prefix={<Search size={16} className="text-gray-500" />}
                        className="w-64 mx-2"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredQueries}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal for viewing query details */}
            <Modal
                title="Query Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedQuery && (
                    <div className="space-y-4">
                        <p><strong>Name:</strong> {selectedQuery.name}</p>
                        <p><strong>Message:</strong> {selectedQuery.message}</p>
                    </div>
                )}
            </Modal>

            {/* email send */}
            <Modal
                title="Send Email"
                visible={isEmailModalVisible}
                onCancel={() => {
                    emailForm.resetFields();
                    setIsEmailModalVisible(false);
                }}
                footer={null}
            >
                <Form layout="vertical" form={emailForm} onFinish={handleSendEmail}>
                    <Form.Item label="Recipient" name="recipient"  >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Content" name="content" rules={[{ required: true }]}>
                        <Input.TextArea rows={6} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Send Email
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* delete */}
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onOk={handleDeleteConfirm}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}

            >
                <p>Are you sure you want to delete this  query?</p>
            </Modal>

        </div>
    );
};

export default QueryList;
