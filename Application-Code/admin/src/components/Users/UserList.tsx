import React from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { Edit, Trash, Mail } from 'lucide-react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { fetchUsers } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store/store';
import { useState } from 'react';
import { userService } from '../../services/api';


const UserList: React.FC = () => {
  const { users: users = [], loading } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addUserForm] = Form.useForm();
  const [editUserForm] = Form.useForm();
  const [deleteReasonForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  // console.log("users", users);


  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);



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
      title: 'Phone',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {/* <Button type="text" icon={<Edit size={16} onClick={() => handleEditClick(record)} />} className="text-blue-600 hover:text-blue-800" /> */}
          <Button type="text" icon={<Trash size={16} />} className="text-red-600 hover:text-red-800"
            onClick={() => showDeleteConfirm(record.id)} />
          <Button type="text" icon={<Mail size={16} onClick={() => handleEmailClick(record.email)} />} className="text-purple-600 hover:text-purple-800" />
        </Space>
      ),

    },
  ];

  // Handle form submit
  const handleCreateUser = async (values: any) => {
    // console.log("values", values);
    
    const hideLoading = message.loading('Creating User...', 0);

    try {
      const user = {
        name: values.name,
        email: values.email,
        number: values.number,
        address: values.address,
        password: values.password,
      };
      const response = await userService.createUser(user); // Call createUser API
      hideLoading();
      // Show success message from backend response
      if (response && response.message) {
        message.success(response.message); // Show success message from backend
      } else {
        message.success('User created successfully'); // Show fallback success message
      }

      dispatch(fetchUsers()); // Refresh the user list
      setIsModalVisible(false); // Close the modal
      addUserForm.resetFields(); // Reset form fields
    } catch (error: any) {
      hideLoading();
      // console.error('Failed to create user:', error.response.data);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // Show backend error message
      } else {
        message.error('Failed to create user. Please try again.');
      }
    }
  };


  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
 

  const handleDeleteUser = async (userId: string, reason: string) => {
    const hideLoading = message.loading('Deleting User...', 0);

    try {
      const response = await userService.deleteUser(userId, reason);
      hideLoading();
      if (response && response.message) {
        message.success(response.message); // Show success message
      } else {
        message.success('User deleted successfully');
      }
      setDeleteModalVisible(false);
      deleteReasonForm.resetFields();
      dispatch(fetchUsers()); // Refresh user list
    } catch (error: any) {
      hideLoading();
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // Show backend error message
      } else {
        message.error('Failed to delete user. Please try again.');
      }
    }
  };

  const showDeleteConfirm = (userId: string) => {
    setUserToDelete(userId);
    setDeleteModalVisible(true); // Show confirmation modal
  };


  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // const [userToEdit, setUserToEdit] = useState<any>(null);


  // const handleEditClick = (user: any) => {
  //   setUserToEdit(user);
  //   editUserForm.setFieldsValue(user);
  //   setIsEditModalVisible(true);
  // };

  // Function to handle updating the user
  // const handleUpdateUser = async (values: any) => {
  //   const hideLoading = message.loading('updating...', 0);

  //   try {
  //     const updatedUser = { ...userToEdit, ...values };
  //     const response = await userService.updateUser(userToEdit.id, updatedUser);
  //     hideLoading();

  //     if (response && response.message) {
  //       message.success(response.message); // Show success message
  //     } else {
  //       message.success('User updated successfully');
  //     }
  //     setIsEditModalVisible(false); // Close modal after updating
  //     dispatch(fetchUsers()); // Refresh the users list
  //     editUserForm.resetFields();
  //   } catch (error: any) {
  //     hideLoading();
  //     if (error.response && error.response.data && error.response.data.message) {
  //       message.error(error.response.data.message); // Show backend error message
  //     } else {
  //       message.error('Failed to update user. Please try again.');
  //     }
  //   }
  // };



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
    setIsEmailModalVisible(true); // Open the modal
};

  const handleSendEmail = async (values: { subject: string, content: string, recipient: string }) => {
    const hideLoading = message.loading('Sending email...', 0);
    try {
      const response = await userService.sendEmail({
        recipients: [values.recipient],
        subject: values.subject,
        content: values.content,
      }); // You can create this service in your api.ts file

      hideLoading();

      if (response && response.message) {
        message.success(response.message); // Show success message
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


  // Function to reset form when modal is closed
  const handleCloseModal = () => {
    emailForm.resetFields(); // Clears form fields when closing the modal
    setIsEmailModalVisible(false);
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        {/* <Button type="primary" onClick={() => setIsModalVisible(true)}>Add User</Button> */}
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: users.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
        }}
        scroll={{ x: true }}
      />

      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={() => {
          addUserForm.resetFields();
          setIsModalVisible(false);
        }}
        footer={null}
      >
        <Form layout="vertical" form={addUserForm} onFinish={handleCreateUser}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Phone Number" name="number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      {/* edit user */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={() => {
          editUserForm.resetFields();
          setIsEditModalVisible(false);
        }}
        footer={null}
      >
        {/* <Form
          layout="vertical"
          initialValues={userToEdit}
          form={editUserForm}
          onFinish={handleUpdateUser}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email"  rules={[{ required: true, type: 'email' }]}>
            <Input disabled />
          </Form.Item>

          <Form.Item label="Phone Number" name="number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update User
            </Button>
          </Form.Item>
        </Form> */}
      </Modal>

      {/* delete */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
      >
        <p>Are you sure you want to delete this user?</p>

        {/* Simple AntD Form */}
        <Form layout="vertical" className='mt-4' form={deleteReasonForm} onFinish={(values) => handleDeleteUser(userToDelete!, values.reason)}>
          <Form.Item label="Reason for Deletion" name="reason" rules={[{ required: true, message: "Please provide a reason!" }]}>
            <Input.TextArea rows={4} placeholder="Enter reason for deleting this user..." />
          </Form.Item>

          <Form.Item>
            <Button onClick={() => setDeleteModalVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" danger>
              Delete User
            </Button>
          </Form.Item>

        </Form>
      </Modal>

      {/* email send */}
      <Modal
        title="Send Email"
        visible={isEmailModalVisible}
        onCancel={handleCloseModal}
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


    </div>
  );
};

export default UserList;