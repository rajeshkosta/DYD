import React from "react";
import { Card, Button, Descriptions, Tag, Image, Divider } from "antd";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  // console.log("booking", booking);
  

  if (!booking) {
    return <p className="text-center text-gray-500">No order selected</p>;
  }

  const handleGoBack = () => {
    navigate("/dashboard/orders");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button className="mb-4" onClick={handleGoBack} icon={<ArrowLeft size={16} />}>
        Go back
      </Button>

      <Card className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/3">
            <Image
              src={booking.designImage}
              alt="Product"
              className="rounded-xl"
              width="100%"
              placeholder
            />
          </div>

          {/* Booking Details */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order #{booking.orderId}
            </h2>

            <Descriptions column={1} bordered size="middle" className="mb-4">
              <Descriptions.Item label="Product Name">{booking.productName}</Descriptions.Item>
              <Descriptions.Item label="Size">{booking.size}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{booking.quantity}</Descriptions.Item>
              <Descriptions.Item label="Price">₹{booking.price}</Descriptions.Item>
              <Descriptions.Item label="Payment Mode">{booking.modeOfPayment}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={booking.status === "pending" ? "orange" : "green"}>
                  {booking.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {moment(booking.createdAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider />

        {/* User Info */}
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Customer Information</h3>
        <Descriptions column={1} bordered size="middle" className="mb-6">
          <Descriptions.Item label="Name">{booking.user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{booking.user?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{booking.user?.number}</Descriptions.Item>
        </Descriptions>

        {/* Address Info */}
        <h3 className="text-xl font-semibold mb-2 text-gray-700">Delivery Address</h3>
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="Name">{booking.address?.name}</Descriptions.Item>
          <Descriptions.Item label="Phone">{booking.address?.number}</Descriptions.Item>
          <Descriptions.Item label="House / Street">
            {booking.address?.house}, {booking.address?.street}
          </Descriptions.Item>
          <Descriptions.Item label="City / State">
            {booking.address?.city}, {booking.address?.state}
          </Descriptions.Item>
          <Descriptions.Item label="Country / ZIP">
            {booking.address?.country}, {booking.address?.zipCode}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default BookingDetails;
