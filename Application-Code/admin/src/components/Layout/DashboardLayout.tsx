import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, LogOut, LayoutDashboard, Star, FileQuestion, MailPlus, Salad, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import "./style.css";

const { Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  // console.log("user", user);


  const handleLogout = () => {
    // console.log("logout");

    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        className="bg-[rgb(31,41,55)] fixed h-screen overflow-hidden"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0 }}
      >
        <div className="p-4 text-center border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{user?.name || 'Admin'}</h2>
          <p className="text-gray-300 text-sm">{user?.email || 'admin@example.com'}</p>
        </div>
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              if (key === 'logout') {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            className="bg-[rgb(31,41,55)] text-white border-none flex-grow"
            items={[
              {
                key: '/dashboard',
                icon: <LayoutDashboard size={18} />,
                label: 'Dashboard',
              },
              {
                key: '/dashboard/users',
                icon: <Users size={18} />,
                label: 'Users',
              },
              {
                key: '/dashboard/products',
                icon: <Salad size={18} />,
                label: 'Products',
              },
              {
                key: '/dashboard/orders',
                icon: <ShieldCheck size={18} />,
                label: 'Orders',
              },
              {
                key: '/dashboard/pages',
                icon: <FileText size={18} />,
                label: 'Pages',
              },
              // {
              //   key: '/dashboard/queries',
              //   icon: <FileQuestion size={18} />,
              //   label: 'Queries',
              // },
              // {
              //   key: '/dashboard/reviews',
              //   icon: <Star size={18} />,
              //   label: 'reviews',
              // }
            ]}

          />
          <Menu
            mode="inline"
            className="bg-[rgb(31,41,55)] text-white border-none mt-auto"
          >
            <Menu.Item
              key="logout"
              icon={<LogOut size={18} />}
              danger
              onClick={handleLogout}  // <-- Attach handler directly
            >
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 250 }}>
        <Content className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;