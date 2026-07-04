import React from "react";
import { Input, Button, Form, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { pageService } from "../../services/api";
import { useLocation } from "react-router-dom";
import { useState } from "react";


const PageForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const page = location.state?.page;
    const [form] = Form.useForm();
    const [content, setContent] = useState(page?.content || "");

    React.useEffect(() => {
        if (page) {
            form.setFieldsValue({
                title: page.title,
                content: page.content
            });
            setContent(page.content);
        }
    }, [page, form]);

    const handleGoBack = () => {
        navigate('/dashboard/pages');
    }

    const handleSubmit = async (values: any) => {
        const hideLoading = message.loading(page ? 'Updating...' : 'Creating...', 0);

        try {
            const payload = {
                title: values.title,
                content: content
            };
            // console.log("Payload Sending:", payload);

            // Call API to submit form with uploaded media URLs
            let response;

            if (page) {
                response = await pageService.updatePage(page.id, payload);  // Edit
            } else {
                response = await pageService.createPage(payload);  // Add
            }
            hideLoading();

            if (response && response.message) {
                message.success(response.message); // Show success message
            } else {
                message.success(page ? 'page updated successfully' : 'page added successfully');
            }
            form.resetFields();
            setContent('');
            navigate('/dashboard/pages');
        } catch (error: any) {
            hideLoading();
            console.error('Failed to create resort:', error);
            if (error.response && error.response.data && error.response.data.error) {
                message.error(error.response.data.error);  // Show backend error message
            } else {
                message.error(' Failed to create resort. Please try again.');
            }
        }
    };

    return (
        <>
            <Button className="mb-4" onClick={handleGoBack} icon={<ArrowLeft size={16} />}>
                Go back
            </Button>
            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">
                    {page ? 'Edit Page' : 'Add New page'}
                </h1>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                        <ReactQuill theme="snow"
                            value={content}
                            onChange={setContent}
                            style={{ height: '300px' }}
                        />
                    </Form.Item>

                    <Form.Item className="mt-16">
                        <Button type="primary" htmlType="submit">
                            {page ? "Update Page" : "Create Page"}
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </>
    );
};

export default PageForm;
