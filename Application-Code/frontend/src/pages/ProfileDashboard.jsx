import { useEffect, useState } from "react";
import { Layout, Menu, Form, Input, Button, Card, Drawer } from "antd";
import { UserOutlined, ShoppingOutlined, HomeOutlined, MenuOutlined } from "@ant-design/icons";
import "../assets/styles/style.css";
const { Sider, Content } = Layout;
import OrderList from "../components/Orders/OrderList";
import Address from "../components/Address/Address";
import { useSelector } from "react-redux";
const ProfileDashboard = () => {
    const [selectedTab, setSelectedTab] = useState("profile");
    const [drawerVisible, setDrawerVisible] = useState(false);




    return (
        <div className="bg-[#F5F7FB] mt-24">
            <Layout className="min-h-screen pt-16 md:pt-12  max-w-7xl mx-auto flex flex-col md:flex-row">
                {/* Hamburger Button (Mobile & Tablet) */}
                <button
                    className="md:hidden fixed top-[7rem] left-4 bg-white p-2 rounded-lg shadow-md"
                    onClick={() => setDrawerVisible(true)}
                >
                    <MenuOutlined className="text-xl" />
                </button>

                {/* Sidebar for Larger Screens */}
                <Sider
                    width={250}
                    className="bg-white shadow-md hidden md:block h-14"
                >
                    <SidebarMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                </Sider>

                {/* Drawer (Hamburger Sidebar for Mobile & Tablet) */}
                <Drawer
                    title="Menu"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    <SidebarMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} closeDrawer={() => setDrawerVisible(false)} />
                </Drawer>

                {/* Main Content */}
                <Content className="px-4 md:px-6 w-full">
                    {selectedTab === "profile" && <ProfileSection />}
                    {selectedTab === "orders" && <OrdersSection />}
                    {selectedTab === "address" && <AddressSection />}
                </Content>
            </Layout>
        </div>
    );
};

// Sidebar Menu Component
const SidebarMenu = ({ selectedTab, setSelectedTab, closeDrawer }) => {
    return (
        <Menu
            mode="vertical"
            selectedKeys={[selectedTab]}
            onClick={(e) => {
                setSelectedTab(e.key);
                if (closeDrawer) closeDrawer();
            }}
            className="p-4"
        >
            <Menu.Item key="profile" className="my-2" icon={<UserOutlined style={{ fontSize: "18px" }} />}>
                Profile
            </Menu.Item>
            <Menu.Item key="orders" icon={<ShoppingOutlined style={{ fontSize: "18px" }} />}>
                My Orders
            </Menu.Item>
            <Menu.Item key="address" icon={<HomeOutlined style={{ fontSize: "18px" }} />}>
                My Address
            </Menu.Item>
        </Menu>
    );
};

// Profile Form
const ProfileSection = () => {
    const user = useSelector((state) => state?.auth?.user?.data);
    // console.log("user", user);
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            const [firstName, ...lastNameParts] = user.name?.split(" ") || ["", ""];
            const lastName = lastNameParts.join("");
            form.setFieldsValue({
                firstName,
                lastName,
                email: user.email,
                number: user.number
            });
        }
    }, [user, form]);

    const handleSubmit = (values) => {
        const fullName = [values.firstName, values.lastName].filter(Boolean).join(" ");
        console.log("Updated User Data:", { ...values, name: fullName });
        // Here you can dispatch an action or make an API call with the updated user data
    };


    return (
        <Card className="shadow-md">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <Form layout="vertical" form={form} initialValues={user}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="First Name" name="firstName" className="w-full ] ">
                        <Input placeholder="Enter here" disabled={!isEditing} className="py-2" />
                    </Form.Item>
                    <Form.Item label="Last Name" name="lastName" className="w-full">
                        <Input placeholder="Enter here" disabled={!isEditing} className="py-2" />
                    </Form.Item>
                    <Form.Item label="Email Address" name="email" className="w-full">
                        <Input placeholder="Enter here" disabled={!isEditing} className="py-2" />
                    </Form.Item>
                    <Form.Item label="Mobile Number" name="number" className="w-full">
                        <Input placeholder="Enter here" disabled className="py-2" />
                    </Form.Item>
                </div>
                <div className="flex gap-2 mt-4">
                    {isEditing ? (
                        <>
                            <Button className="bg-gray-300 text-black" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={() => setIsEditing(true)}>Edit Details</Button>
                    )}
                </div>
            </Form>
        </Card>
    );
};

// Orders Section
const OrdersSection = () => {
    return (
        <Card className="shadow-md">
            <h2 className="text-xl font-bold mb-4">My Orders</h2>
            <OrderList />
        </Card>
    );
};

// Address Section
const AddressSection = () => {
    return (
        <Card className="shadow-md">
            <h2 className="text-xl font-bold mb-4">My Address</h2>
            <Address />
        </Card>
    );
};

export default ProfileDashboard;
