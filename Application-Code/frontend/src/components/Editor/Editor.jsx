import { Circle, Utensils, Download, Edit, X, Upload, } from 'lucide-react';
import { Modal, Input, Form, Button, message, Drawer } from 'antd';
import { useState } from 'react';
import { freepikService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails } from '../../store/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const Editor = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [bass64Image, setBass64Image] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { userDetails, error } = useSelector((state) => state.user);

    // console.log("userDetails", userDetails);


    useEffect(() => {
        dispatch(fetchUserDetails());
    }, [dispatch]);

    const allImages = userDetails?.creation?.map((c) => c.image) || [];


    const handleModal = () => {
        setIsOpen(true);
    }

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await freepikService.genrateImage({ prompt: values.prompt });
            // console.log("response", response.data);

            if (response.data?.data?.length > 0 && response.data.data[0].base64) {
                const base64Image = response.data.data[0].base64;
                setImageUrl(`data:image/png;base64,${base64Image}`);
                setBass64Image(base64Image);
                // const base64Image = response.data.imageUrl;
                // setImageUrl(base64Image);
                message.success('Image generated successfully!');
            } else {
                message.error('Failed to generate image. Please try again.');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            message.error('Failed to generate image. Please try again.');
        } finally {
            setLoading(false);
            setIsOpen(false);
            form.resetFields();
        }
    };

    const handleBgRemove = async () => {
        if (!imageUrl) {
            message.error("No image available to remove background.");
            return;
        }

        const hideLoading = message.loading("Removing background...", 0);
        try {

            // Step 1: Convert base64 to Blob
            const byteString = atob(bass64Image);
            const mimeString = "image/png";
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });

            // console.log("blob", blob);

            // Step 2: Create FormData and upload to backend
            const form = new FormData();
            form.append("fieldName", "image");
            form.append("file", blob, "image.png");

            const uploadRes = await freepikService.uploadMedia(form);
            // console.log("respnse data from cloudinary", uploadRes.data);

            const cloudUrl = uploadRes.data?.data?.url;
            const uploadedImageId = uploadRes.data?.data?.id;
            if (!cloudUrl) throw new Error("Failed to upload image");


            // Call the API through freepikService
            const response = await freepikService.bgRemove({ base64Image: cloudUrl });
            // console.log("response", response.data);

            if (response.data?.url) {
                const newUrl = response.data.url;
                setImageUrl(newUrl);
                message.success("Background removed successfully!");
                // 🔥 Call delete API here
                await freepikService.deleteMedia(uploadedImageId);
            } else {

                message.error("Failed to remove background. Please try again.");
            }
            hideLoading();

        } catch (error) {
            hideLoading();
            console.error("Error removing background:", error);
            message.error("Failed to remove background. Please try again.");
        } finally {
            setLoading(false);
            hideLoading();
        }
    };

    // Download image function
    const handleDownload = () => {
        if (!imageUrl) return;

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'generated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePlace = () => {
        navigate("/tshirtCustomizer", { state: { imageUrl: imageUrl } });
    }


    const handleBack = () => {
        navigate("/");
    }

    // console.log("imageUrl", imageUrl);


    const handleSave = async () => {
        if (!imageUrl) {
            message.error("No image to save.");
            return;
        }

        const hideLoading = message.loading("Saving creation...", 0);
        try {
            let imageUrlToSend = imageUrl;

            // If base64, upload to cloud first
            if (imageUrl.startsWith("data:image")) {
                const base64Data = imageUrl.split(',')[1];
                const byteString = atob(base64Data);
                const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];

                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                const blob = new Blob([ab], { type: mimeString });
                const formData = new FormData();
                formData.append("fieldName", "image");
                formData.append("file", blob, "image.png");

                const uploadRes = await freepikService.uploadMedia(formData);
                imageUrlToSend = uploadRes.data?.data?.url;

                if (!imageUrlToSend) {
                    throw new Error("Image upload failed");
                }
            }

            // Send image URL to backend
            const payload = {
                images: [imageUrlToSend],
            };
            await freepikService.addCreation(payload);
            dispatch(fetchUserDetails());
            message.success("Creation saved successfully!");
        } catch (error) {
            console.error("Save creation error:", error);
            message.error("Failed to save creation. Please try again.");
        } finally {
            hideLoading();
        }
    };


    const [isCreationOpen, setIsCreationOpen] = useState(false);

    const handleCReation = () => {
        setIsCreationOpen(true);
    };

    // const [selectedImage, setSelectedImage] = useState(null);

    // console.log("selectedImage", selectedImage);
    


    return (
        <div className="min-h-screen bg-[#F5F7FB] text-black flex flex-col items-center pt-24 px-4 md:px-0">
            {/* Top Navbar */}
            <div className="w-full max-w-4xl flex justify-between items-center p-4 bg-white rounded-lg shadow-md md:mt-6 mt-8 ">
                <button className='px-4 py-2 bg-slate-300 rounded-lg hover:bg-gray-600'
                    onClick={handleModal}
                >Ai Image</button>
                {/* <button>My creation</button> */}
                <div className="flex space-x-4">
                    <button className=" p-2 rounded-lg hover:bg-gray-600">
                        <Upload className="w-5 h-5" />
                    </button>
                    <button className=" p-2 rounded-lg hover:bg-gray-600"
                        onClick={handleDownload}
                        disabled={!imageUrl}
                        style={{ cursor: imageUrl ? 'pointer' : 'not-allowed' }}
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button className=" p-2 rounded-lg hover:bg-red-500" onClick={handleBack}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Centered Content */}
            <div className="flex flex-col items-center  md:mt-6">
                <div className=" w-40 h-80 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center ">
                    {imageUrl ? (
                        <img src={imageUrl || selectedImage} alt="Generated" className="w-56 h-56 object-cover rounded-lg shadow-lg" />
                    ) : (
                        <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Circle className="text-blue-500 w-full h-full" fill="#3b82f6" stroke="none" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center space-x-3 text-white">
                                <Utensils className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                {/* <button className="px-4 py-2 border rounded-lg hover:bg-gray-600">Retouch</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-600">Erase</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-600">Resize</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-600">Upscale</button> */}
                <button className="px-4 py-2 border bg-white rounded-lg hover:bg-gray-600" onClick={handleCReation}>My creation</button>
                <button className="px-4 py-2 border bg-white rounded-lg hover:bg-gray-600" onClick={handleSave}>Save</button>
                {/* <button className="px-4 py-2 border bg-white rounded-lg hover:bg-gray-600" onClick={handleBgRemove}>Remove Background</button> */}
            </div>

            {/* Bottom Button */}
            <button onClick={handlePlace} className="mt-8 bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-400 text-black font-semibold">
                Place your t-shirt
            </button>

            <Modal title="Text to Image" open={isOpen} onCancel={() => {
                setIsOpen(false);
                form.resetFields();
            }} footer={null}>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name="prompt" rules={[{ required: true, message: 'Please enter a prompt' }]}>
                        <Input.TextArea rows={4} placeholder="Describe the image you want to generate..." />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="mt-2 w-full">
                        Generate
                    </Button>
                </Form>
            </Modal>


            <Drawer
                title="My Creation"
                placement="left"
                onClose={() => setIsCreationOpen(false)}
                open={isCreationOpen}

            >
                <div>
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : allImages.length === 0 ? (
                        <p className="text-center text-gray-400">No creations found.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {allImages?.map((img, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 aspect-square relative cursor-pointer"
                                    onClick={() => setImageUrl(img)}
                                >
                                    <img
                                        src={img}
                                        alt={`Creation ${index + 1}`}
                                        className="w-full h-full object-cover border-2"
                                    />
                                    {imageUrl === img && (
                                        <div className="absolute top-1 right-1 bg-white rounded-full p-1">
                                            <input type="checkbox" checked readOnly />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default Editor;
