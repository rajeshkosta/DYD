import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetails } from "../../store/slices/userSlice";
import { useEffect, useState } from "react";
import { message, Form, Button, Input, Modal } from "antd"
import { authService } from "../../services/api";


const Address = () => {
    const dispatch = useDispatch();
    const { userDetails, loading, error } = useSelector((state) => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingAddress, setEditingAddress] = useState(null);

    // console.log("userDetails", userDetails);

    useEffect(() => {
        dispatch(fetchUserDetails());
    }, [dispatch]);


    if (error) {
        message.error(error)
    }

    const handleAddAddress = (address = null) => {
        setIsModalOpen(true);
        setEditingAddress(address ? address.id : null);

        if (address) {
            form.setFieldsValue({
                name: address.name,
                house: address.house,
                street: address.street,
                city: address.city,
                state: address.state,
                country: address.country,
                zipCode: address.zipCode,
                number: address.number,
            });
        } else {
            form.resetFields();
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        form.resetFields(); // Reset form when modal is closed
    };

    const handleSubmit = async (values) => {
        const hideLoading = message.loading(editingAddress ? "Updating Address..." : "Adding Address...", 0);
        try {
            const payload = {
                name: values.name,
                house: values.house,
                street: values.street,
                city: values.city,
                state: values.state,
                country: values.country,
                zipCode: values.zipCode,
                number: values.number,
            }

            let response;
            if (editingAddress) {
                response = await authService.updateAddress(editingAddress, payload);
            } else {
                response = await authService.addAddress(payload);
            }

            if (response.status === 201 || response.status === 200) {
                message.success(response.data.message);
                dispatch(fetchUserDetails());
            }
            setIsModalOpen(false);
            form.resetFields();
            hideLoading();
        } catch (error) {
            hideLoading();
            message.error(error.response?.data?.message || "Failed to add address");
        }
    };

    const [confirmation, setConfirmation] = useState(false);
    const [addressId, setAddressId] = useState(null);

    const handleConfirmDelete = (id) => {
        setConfirmation(true);
        setAddressId(id);
    };
    const handleDelete = async () => {
        try {
            const response = await authService.deleteAddress(addressId);
            if (response.status === 200) {
                message.success(response.data.message);
                dispatch(fetchUserDetails());
            }
            setConfirmation(false);
            setAddressId(null);
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to delete address");
        }
    }

    return (
        <div className=" mx-auto py-6 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing Address */}
                {userDetails?.address.map((addr) => (
                    <div key={addr.id} className="p-4 border rounded-lg shadow-sm">
                        <p className="font-bold">{addr?.name}</p>
                        <p className="text-gray-600 text-sm mt-1">{addr?.house}, {addr?.street},  {addr?.city}, {addr?.country}</p>
                        <p className="text-gray-600 text-sm mt-1">{addr?.state}: {addr?.zipCode}</p>
                        <p className="text-gray-600 text-sm mt-1">{addr.number}</p>
                        {/* Actions */}
                        <div className="mt-3 flex gap-4">
                            <button className="text-blue-600 hover:underline" onClick={() => handleAddAddress(addr)}>Edit</button>
                            <button className="text-red-600 hover:underline" onClick={() => handleConfirmDelete(addr.id)}>Delete</button>
                        </div>
                    </div>
                ))}

                {/* Add New Address */}
                <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200" onClick={handleAddAddress}>
                    <button className="text-blue-600 flex items-center gap-2">
                        <span className="text-lg">➕</span> Add address
                    </button>
                </div>
            </div>

            {/* Address Modal */}
            <Modal
                title={editingAddress ? "Edit Address" : "Add Address"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        Save Address
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="flex gap-4">
                        <Form.Item label="Receiver Name" name="name" >
                            <Input placeholder="Enter Receiver Name" />
                        </Form.Item>
                        <Form.Item label="House" name="house" rules={[{ required: true, message: "Please enter house details" }]}>
                            <Input placeholder="Enter house details" />
                        </Form.Item>
                    </div>
                    <Form.Item label="Street" name="street" rules={[{ required: true, message: "Please enter street" }]}>
                        <Input placeholder="Enter street" />
                    </Form.Item>
                    <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter city" }]}>
                        <Input placeholder="Enter city" />
                    </Form.Item>
                    <Form.Item label="State" name="state" rules={[{ required: true, message: "Please enter state" }]}>
                        <Input placeholder="Enter state" />
                    </Form.Item>
                    <Form.Item label="Country" name="country" rules={[{ message: "Please enter country" }]}>
                        <Input placeholder="Enter country" />
                    </Form.Item>
                    <Form.Item label="Zip Code" name="zipCode" rules={[{ required: true, message: "Please enter zip code" }]}>
                        <Input placeholder="Enter zip code" />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="number" rules={[{ message: "Please enter phone number" }]}>
                        <Input placeholder="Enter alternate number" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal open={confirmation}
                onCancel={() => setConfirmation(false)}
                onOk={handleDelete}
            >
                <p>Are you sure you want to delete this address?</p>

            </Modal>
        </div>
    );
};

export default Address;
