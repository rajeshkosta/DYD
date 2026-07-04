import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import image from "../../assets/img/t-shirt.png";
import { Drawer, message, Input, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/api";
import DesignEditor from "./DesignEditor";
import { freepikService } from "../../services/api";
import { fetchProducts } from "../../store/slices/productSlice";
import { productService } from "../../services/api";


const TshirtCustomizer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logo = location?.state?.imageUrl || null;
    const dispatch = useDispatch();
    const { userDetails, loading, error } = useSelector((state) => state.user);
    const { products } = useSelector((state) => state.products);

    // console.log("products", products);

    useEffect(() => {
        dispatch(fetchUserDetails());
        dispatch(fetchProducts());
    }, [dispatch]);

    // console.log("logo", logo);


    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD");

    const handleAddAddress = () => {
        navigate('/profileDashBord');
    }

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [exportedImage, setExportedImage] = useState(null);
    const designEditorRef = useRef(null);

    const [finalDesignImage, setFinalDesignImage] = useState(null);
    const [logoPos, setLogoPos] = useState({
        x: 150,
        y: 150,
        width: 100,
        height: 100,
    });
    // console.log("finalDesignImage", finalDesignImage);


    const price = 400;
    const productName = "Unisex Garment-Dyed T-shirt";

    const handleExportedImage = (uri) => {
        setFinalDesignImage(uri);
    };

    const base64ToBlob = (base64, mimeType = 'image/png') => {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    }

    const uploadBase64ToCloud = async (base64) => {
        const blob = base64ToBlob(base64);
        const formData = new FormData();
        formData.append("fieldName", "image");
        formData.append("file", blob, "image.png");

        const uploadRes = await freepikService.uploadMedia(formData);
        return uploadRes?.data?.data?.url; // Return uploaded image URL
    };


    const handlePlaceOrder = async () => {
        const hideLoading = message.loading("Placing order...", 0);
        try {
            // if (designEditorRef.current && designEditorRef.current.exportCanvas) {
            //     const imageUrl = await designEditorRef.current.exportCanvas();
            //      setFinalDesignImage(imageUrl);
            // }

            if (designEditorRef.current) {
                await designEditorRef.current.handleExport();
            }

            if (!selectedAddressId || !selectedSize) {
                return alert("Please select size and address before placing order.");
            }

            let finalImage = '';
            let logoFinal = '';

            if (logo && logo.startsWith("data:image")) {
                logoFinal = await uploadBase64ToCloud(logo)
            } else {
                logoFinal = logo
            }

            if (finalDesignImage && finalDesignImage.startsWith("data:image")) {
                finalImage = await uploadBase64ToCloud(finalDesignImage)
            } else {
                finalImage = finalDesignImage
            }

            const payload = {
                addressId: selectedAddressId,
                price,
                designImage: finalImage,
                logo: logoFinal,
                size: selectedSize,
                quantity: selectedQuantity,
                modeOfPayment: selectedPaymentMethod,
                productName,
            };

            const res = await orderService.placeOrder(payload);

            if (res.status === 200) {
                message.success(res.data.message);
                navigate("/profileDashBord");
            }

            hideLoading();
            setIsOpenDrawer(false);
        } catch (err) {
            hideLoading();
            console.error("Failed to place order:", err);
            message.error("Failed to place order. Please try again.");
        }
    };


    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const handleOpenDrawer = () => {
        if (!finalDesignImage && !selectedSize) {
            message.error("Please save your t-shirt design and select a size first.");
            return;
        }

        if (!finalDesignImage) {
            message.error("Please select a design first");
            return
        }

        if (!selectedSize) {
            message.error("Please select an size first.");
            return
        }

        setIsOpenDrawer(true);
    }

    const handleBack = () => {
        navigate('/editor')
    }


    return (
        <div className="min-h-screen  bg-[#F5F7FB] pt-24 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {products[0] && (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12">
                        {/* T-shirt Preview Section */}

                        <div className="relative w-full  flex justify-center bg-white rounded-lg ">
                            {/* <img
                                src={image}
                                alt="T-shirt"
                                className="w-full max-w-md object-cover"
                            />

                            {logo && (
                                <img
                                    src={logo}
                                    alt="Custom Logo"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 opacity-90"
                                />
                            )} */}

                            <DesignEditor
                                // ref={designEditorRef}
                                tShirtImage={products[0]?.images?.[0]}
                                logoImage={logo}
                                logoPos={logoPos}
                                setLogoPos={setLogoPos}
                                // onExport={(uri) => setExportedImage(uri)}
                                onExport={handleExportedImage}
                            />

                        </div>

                        {/* Product Details Section */}
                        <div className="w-full  flex  justify-start items-start pb-10">
                            <div>
                                <p className=" text-2xl md:text-4xl font-semibold">{products[0]?.name}</p>
                                <p className="text-blue-600 text-xl font-semibold">₹{products[0]?.price}</p>

                                {/* Size Selection */}
                                <div className="mt-4">
                                    <p className="text-sm font-normal">Size</p>
                                    <div className="flex space-x-2 mt-2">
                                        {products[0]?.size?.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedSize(item.label)}
                                                className={`px-3 py-1 rounded-full border ${selectedSize === item.label
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-[#A8AAB3] hover:bg-gray-100"
                                                    }`}
                                            >
                                                {item.label.toUpperCase()} ({item.value}cm)
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="mt-8">
                                    <h3 className="text-sm font-normal">Qty</h3>
                                    <select
                                        className="mt-2 p-2 bg-white rounded-full w-32"
                                        value={selectedQuantity}
                                        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                    >
                                        {Array.from({ length: products[0]?.quantity || 0 }, (_, i) => i + 1).map((qty) => (
                                            <option key={qty} value={qty}>
                                                {qty}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex space-x-4">
                                    <button className="px-4 py-2 text-[#3558A9] border border-[#3558A9] rounded-md hover:bg-gray-100"
                                        onClick={handleBack}
                                    >
                                        Edit designing
                                    </button>

                                    <button className="px-4 py-2 bg-[#3558A9] text-white rounded-md hover:bg-blue-500"
                                        onClick={handleOpenDrawer}
                                    >
                                        Buy now
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Drawer
                            placement="right"
                            onClose={() => setIsOpenDrawer(false)}
                            open={isOpenDrawer}
                            width={window.innerWidth < 768 ? '100%' : 400}
                            title={` ${currentStep === 1 ? 'Select Address' : 'Select Payment'}`}
                        >
                            {/* Step 1: Address */}
                            {currentStep === 1 && (
                                <div>
                                    <p className="text-sm font-normal text-[#545454] mb-4">Detailed address will help our delivery partner reach your
                                        doorstep quickly</p>

                                    <div className="bg-[#F5F7FB] py-4 border-2 border-[#3558A9] border-dashed rounded-md text-center mb-4">
                                        <button
                                            className="text-[#3558A9]"
                                        > <span className="px-1 rounded-full bg-white border-2 border-[#3558A9]"
                                            onClick={handleAddAddress}
                                        >+</span> Add New Address</button>
                                    </div>

                                    <div className="space-y-3">
                                        {userDetails?.address.map((addr) => (
                                            <div key={addr.id}
                                                className={`p-4 border rounded-lg shadow-sm cursor-pointer ${selectedAddressId === addr.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
                                                    }`}
                                                onClick={() => setSelectedAddressId(addr.id)}
                                            >
                                                <p className="font-bold">{addr?.name}</p>
                                                <p className="text-gray-600 text-sm mt-1">{addr?.house}, {addr?.street},  {addr?.city}, {addr?.country}</p>
                                                <p className="text-gray-600 text-sm mt-1">{addr?.state}: {addr?.zipCode}</p>
                                                <p className="text-gray-600 text-sm mt-1">{addr.number}</p>
                                                {/* Actions */}
                                                <div className="mt-3 flex gap-4">
                                                    <button className="text-blue-600 hover:underline" onClick={() => handleAddAddress(addr)}>Edit</button>
                                                    {/* <button className="text-red-600 hover:underline" onClick={() => handleConfirmDelete(addr.id)}>Delete</button> */}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    className="hidden"
                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                    checked={selectedAddressId === addr.id}
                                                />

                                            </div>

                                        ))}
                                    </div>

                                    <div className="border-t  bg-white sticky bottom-0 z-10">

                                        <button
                                            onClick={() => setCurrentStep(2)}
                                            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md w-full "
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <div>
                                    {/* <p className="text-lg font-semibold mb-4">Select Payment Method</p> */}

                                    {/* Payment Options */}
                                    <div className="flex space-x-4 mb-6">
                                        <button
                                            onClick={() => setSelectedPaymentMethod('ONLINE')}
                                            className={`px-4 py-2 rounded-full border ${selectedPaymentMethod === 'ONLINE'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            Online
                                        </button>
                                        <button
                                            onClick={() => setSelectedPaymentMethod('COD')}
                                            className={`px-4 py-2 rounded-full border ${selectedPaymentMethod === 'COD'
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            COD
                                        </button>
                                    </div>

                                    {/* Conditional UI based on payment selection */}
                                    {selectedPaymentMethod === 'ONLINE' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">Pay securely with UPI, NetBanking, or Card.</p>
                                            <button className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
                                                onClick={handlePlaceOrder}
                                            >
                                                Proceed to Online Payment
                                            </button>
                                        </div>
                                    )}

                                    {selectedPaymentMethod === 'COD' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-600">You will pay ₹400 in cash when the product is delivered.</p>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
                                                onClick={handlePlaceOrder}
                                            >
                                                Confirm Order (COD)
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="mt-4 text-gray-500 underline text-sm"
                                    >
                                        ← Go Back
                                    </button>
                                </div>
                            )}


                        </Drawer>

                    </div>

                )}
            </div>
        </div>
    );
};

export default TshirtCustomizer;
