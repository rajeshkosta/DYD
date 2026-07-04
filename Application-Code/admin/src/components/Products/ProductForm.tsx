import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Select, Progress, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService, mediaAndReviewService } from '../../services/api';
import { ArrowLeft } from 'lucide-react';



const { Option } = Select;

const ProductForm: React.FC = () => {
    const location = useLocation();
    const product = location.state?.product;
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string[]>(product?.images || []);
    const [videoUrl, setVideoUrl] = useState<string[]>(product?.videos || []);
    const [sizeLabel, setSizeLabel] = useState("");
    const [sizeValue, setSizeValue] = useState("");
    const [sizes, setSizes] = useState<{ label: string; value: string }[]>([]);

    const [sizeInput, setSizeInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                description: product.description
            });
            setImageUrl(product.images || []);
            setVideoUrl(product.videos || []);
            setSizes(product.size || []);
        }
    }, [product, form]);


    const [imageIds, setImageIds] = useState<(string | null)[]>(product?.image?.map(() => null) || []);
    const [videoIds, setVideoIds] = useState<(string | null)[]>(product?.video?.map(() => null) || []);


    const handleAddSize = () => {
        const trimmedLabel = sizeLabel.trim();
        const trimmedValue = sizeValue.trim();

        if (trimmedLabel && trimmedValue) {
            setSizes([...sizes, { label: trimmedLabel, value: trimmedValue }]);
            setSizeLabel("");
            setSizeValue("");
        }
    };

    const handleRemoveSize = (index: number) => {
        const updatedSizes = [...sizes];
        updatedSizes.splice(index, 1);
        setSizes(updatedSizes);
    };



    // console.log("imageId", imageIds);


    const handleImageChange = async ({ file, onSuccess, onError }: any) => {
        const actualFile = file.originFileObj || file;

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', actualFile);
            formData.append('fieldName', 'image');

            const response = await mediaAndReviewService.uploadMedia(formData, (progressEvent) => {
                if (progressEvent.total !== undefined) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);  // Update the progress bar
                }
            });

            if (response && response.data && response.data.url) {
                setImageUrl(prev => [...prev, response.data.url]);
                // console.log("response.data", response);
                setImageIds(prev => [...prev, response.data.id]);
                message.success(response.message);
                onSuccess();
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            message.error(error.response?.data?.message || 'Image upload failed');
            onError(error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    // Handle video file change
    const handleVideoChange = async ({ file, onSuccess, onError }: any) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('fieldName', 'video');  // Important fieldName for backend


            const response = await mediaAndReviewService.uploadMedia(formData, (progressEvent) => {
                if (progressEvent.total !== undefined) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);  // Update the progress bar
                }
            });

            if (response && response.data && response.data.url) {
                setVideoUrl(prev => [...prev, response.data.url]);
                // Store uploaded URL
                setVideoIds(prev => [...prev, response.data.id]);
                message.success(response.message);
                // console.log("response.data", response);
                onSuccess();  // Notify antd that upload succeeded
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Upload failed:', error);
            message.error(error.response?.data?.message || 'video upload failed');
            onError(error);  // Notify antd that upload failed
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const deleteMedia = async (type: "image" | "video", index: number) => {
        console.log("funcation called");

        const hideLoading = message.loading('deleting...', 0);
        try {
            let mediaId = null;

            if (type === "image") {
                mediaId = imageIds[index]
            } else if (type === "video") {
                mediaId = videoIds[index]
            }


            if (mediaId) {
                console.log("mediaId", mediaId);

                // Call your backend API to delete the media using its id
                const response = await mediaAndReviewService.deleteMedia(mediaId);
                // console.log("status", response.status);

                hideLoading();
                // Check if the response contains a success message
                if (response?.status === 200) {
                    // Update the state to remove the media from the list
                    if (type === "image") {
                        setImageUrl(prev => prev.filter((_, i) => i !== index));
                        setImageIds(prev => prev.filter((_, i) => i !== index));
                    } else if (type === "video") {
                        setVideoUrl(prev => prev.filter((_, i) => i !== index));
                        setVideoIds(prev => prev.filter((_, i) => i !== index));
                    }

                    message.success(response?.data?.message); // Show success message
                } else {
                    // console.log("Failed Response:", response?.data); // Log the response when it fails
                    message.error('Failed to delete media'); // Show failure message if deletion fails
                }

            } else {
                if (type === "image") {
                    setImageUrl(prev => prev.filter((_, i) => i !== index));
                    setImageIds(prev => prev.filter((_, i) => i !== index));
                } else if (type === "video") {
                    setVideoUrl(prev => prev.filter((_, i) => i !== index));
                    setVideoIds(prev => prev.filter((_, i) => i !== index));
                }
                hideLoading();
            }
        } catch (error: any) {
            hideLoading();
            console.error('Failed to delete media:', error);
            message.error(error.response?.data?.message || 'Video upload failed');
        }
    };

    const handleSubmit = async (values: any) => {
        const hideLoading = message.loading(product ? 'Updating...' : 'Creating...', 0);
        try {
            const payload = {
                name: values.name,
                category: values.category,
                price: parseFloat(values.price),
                size: sizes,
                quantity: parseFloat(values.quantity),
                images: imageUrl.filter(Boolean) || [],
                videos: videoUrl.filter(Boolean) || []
            };
            let response;

            if (product) {
                response = await productService.updateProduct(product.id, payload);
            } else {
                response = await productService.addProduct(payload);
            }

            hideLoading();
            message.success(response.message || 'Operation successful');
            form.resetFields();
            navigate('/dashboard/products');
        } catch (error: any) {
            hideLoading();
            message.error(error.response?.data?.message || 'Failed to save product.');
        }
    };



    return (
        <>
            <Button className="mb-4" onClick={() => navigate('/dashboard/products')} icon={<ArrowLeft size={16} />}> Go back </Button>
            <div className="p-6 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h1>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>

                    <div className='grid  grid-cols-2 gap-4'>
                        <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
                            <Input placeholder="Enter product name" />
                        </Form.Item>

                        {/* <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select category' }]}>
                            <Select placeholder="Select category">
                                <Option value="chinese">Chinese</Option>
                                <Option value="indian">Indian</Option>
                                <Option value="breakfast">Breakfast</Option>
                                <Option value="lunch">Lunch</Option>
                                <Option value="dinner">Dinner</Option>
                                <Option value="starters">Starters</Option>
                                <Option value="main_course">Main Course</Option>
                                <Option value="desserts">Desserts</Option>
                                <Option value="beverages">Beverages</Option>
                            </Select>
                        </Form.Item> */}

                        <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
                            <InputNumber min={0} className="w-full" placeholder="Enter price" />
                        </Form.Item>

                        <Form.Item label="Sizes">
                            <div className="flex gap-4 mb-2">
                                <Input
                                    placeholder="Size label (e.g. XL)"
                                    value={sizeLabel}
                                    onChange={(e) => setSizeLabel(e.target.value)}
                                />
                                <Input
                                    placeholder="Size value (e.g. 34cm)"
                                    value={sizeValue}
                                    onChange={(e) => setSizeValue(e.target.value)}
                                />
                                <Button onClick={handleAddSize}>Add</Button>
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {sizes.map((size, index) => (
                                    <div key={index} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                                        <span>{size.label} {size.value}</span>
                                        <Button
                                            type="link"
                                            onClick={() => handleRemoveSize(index)}
                                            style={{ padding: 0, color: "red" }}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Form.Item>

                        <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                            <InputNumber placeholder="Enter quantity " />
                        </Form.Item>

                        {uploading && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
                                <Progress type="circle" percent={progress} />
                            </div>
                        )}

                        <div className='grid grid-cols-2'>
                            {/* Image upload button */}
                            <Form.Item label="Upload Image" name="image">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    customRequest={handleImageChange}
                                    accept="image/*"
                                >
                                    <Button
                                        icon={<UploadOutlined />}

                                    >Upload Image</Button>
                                </Upload>
                            </Form.Item>

                            {/* Video upload button */}
                            <Form.Item label="Upload Video" name="video">
                                <Upload
                                    name="file"
                                    showUploadList={false}
                                    customRequest={handleVideoChange}
                                    accept="video/*"
                                >

                                    <Button icon={<UploadOutlined />}>Upload Video</Button>

                                </Upload>
                            </Form.Item>
                        </div>
                    </div>

                    {/* Display uploaded images */}
                    <div className='flex '>
                        {imageUrl.length > 0 && (
                            <>
                                <h4>Uploaded Images:</h4>
                                {imageUrl.map((media: any, index) => (
                                    <div key={index} className='relative'>
                                        <img src={media} alt="uploaded" style={{ width: '100px', height: '100px' }} className='mx-4 rounded-md' />

                                        <Button
                                            type="link"
                                            onClick={() => deleteMedia("image", index)} // Use `id` of the media
                                            style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '0',
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '4px 8px',
                                            }}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Display uploaded videos */}
                    <div className='flex mt-6' >
                        {videoUrl.length > 0 && (
                            <>
                                <h4>Uploaded Videos:</h4>
                                {videoUrl.map((media: any, index) => (
                                    <div key={index} className='relative'>
                                        <video width="200" controls className='mx-6'>
                                            <source src={media.url || media} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <Button
                                            type="link"
                                            onClick={() => deleteMedia("video", index)} // Use `id` of the media
                                            style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '0',
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '4px 8px',
                                            }}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ProductForm;
