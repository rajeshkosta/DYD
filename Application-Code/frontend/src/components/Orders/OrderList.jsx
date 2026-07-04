import React from "react";
import { useEffect } from "react";
import shirt from "../../assets/img/t-shirt.png";
import { fetchUserDetails } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import moment from "moment";

const OrderList = () => {
  const dispatch = useDispatch();
  const { userDetails, loading, error } = useSelector((state) => state.user);
  // console.log("userDetails", userDetails);


  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   message.error(error);
  // }

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);


  return (

    <div className="mt-8">
      <div className="space-y-6">
        {userDetails?.order.map((order, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-4">
            {/* Left: Image & Details */}
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 border rounded-lg flex justify-center items-center relative">
                <img src={order?.designImage || shirt} alt="Product" className="w-32 h-32 rounded-md  object-contain" />
                {/* <img
                  src={order?.designImage}
                  alt="Custom Logo"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 opacity-90"
                /> */}
              </div>
              <div>
                <p className="font-bold">{order?.orderId}</p>
                <p className="text-gray-500 text-sm">
                  Placed on {moment(order.createdAt).format("Do MMMM YYYY")}, {moment(order.createdAt).format("hh:mm A")}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Size: {order.size}, Qty: {order.quantity}
                </p>
              </div>
            </div>

            {/* Right: Price & Status */}
            <div className="text-right ">
              <p className="font-semibold text-lg my-4">₹{order.price}</p>
              <span
                className={`px-3 py-1 text-sm font-medium my-4 rounded-full ${order.status === "delivered" ? "bg-[#01D701] text-white" : order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-yellow-500 text-white"
                  }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default OrderList;
