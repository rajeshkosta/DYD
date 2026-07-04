import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/api';
import { UserCog } from "lucide-react";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await authService.login(values);
      dispatch(setCredentials(response));
      navigate('/dashboard');
    } catch (error: any) {
      // console.error('Login error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // Show backend error message
      } else {
        message.error('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <UserCog className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </div>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;