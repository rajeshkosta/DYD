import React from "react";
import { Card, Button, Tag, Divider } from "antd";
import { Image, Video, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  if (!product) return <p className="text-center text-gray-500 mt-10">No product selected</p>;

  const handleGoback = () => {
    navigate('/dashboard/products');
  };

  const handleEdit = () => {
    navigate('/dashboard/productForm', { state: { product } });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Button type="default" className="mb-4" onClick={handleGoback} icon={<ArrowLeft size={16} />}>
          Go back
        </Button>

        <Card
          title={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              <Tag color={product.status ? "green" : "red"} className="mt-2 sm:mt-0">
                {product.status ? "Active" : "Inactive"}
              </Tag>
            </div>
          }
          className="shadow-lg rounded-2xl bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2"><strong>Price:</strong> ₹{product.price}</p>
              <p className="text-gray-600 mb-2"><strong>Size:</strong> {product.size.map((size: string) => size).join(", ")}</p>
              <p className="text-gray-600 mb-2"><strong>Inventory:</strong> {product.quantity}</p>
              <p className="text-gray-600 mb-2"><strong>Category:</strong> {product.category || "N/A"}</p>
            </div>
          </div>

          <Divider className="my-6">Images</Divider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {product.images?.length ? (
              product.images.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product Image ${index + 1}`}
                  className="w-[500px] h-auto object-cover rounded-xl shadow border"
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-200 rounded-lg">
                <Image className="w-10 h-10 text-gray-400" />
                <p className="ml-2 text-gray-500">No image found</p>
              </div>
            )}
          </div>

          <Divider className="my-6">Videos</Divider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {product.videos?.length ? (
              product.videos.map((video: string, index: number) => (
                <video
                  key={index}
                  controls
                  className=" h-10 object-contain rounded-xl shadow border"
                >
                  <source src={video} type="video/mp4" />
                </video>
              ))
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-200 rounded-lg">
                <Video className="w-10 h-10 text-gray-400" />
                <p className="ml-2 text-gray-500">No video found</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button type="primary" onClick={handleEdit}>
              Edit Product
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
