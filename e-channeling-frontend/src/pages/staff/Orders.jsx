import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchRejectedOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/orders/rejected`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      const imageOrder = await Promise.all(
        data.map(async (order) => {
          const image = await axios.get(
            `http://localhost:8080/patient/order/prescription-image/${order.prescriptionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );
          const imageUrl = URL.createObjectURL(image.data);
          return {
            ...order,
            prescriptionImage: imageUrl,
          };
        })
      );
      setRejectedOrders(imageOrder);
      console.log(imageOrder);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/orders/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      const imageOrder = await Promise.all(
        data.map(async (order) => {
          const image = await axios.get(
            `http://localhost:8080/patient/order/prescription-image/${order.prescriptionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );
          const imageUrl = URL.createObjectURL(image.data);
          return {
            ...order,
            prescriptionImage: imageUrl,
          };
        })
      );
      setPendingOrders(imageOrder);
      console.log(imageOrder);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/orders/delivered`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;

      const imageOrder = await Promise.all(
        data.map(async (order) => {
          const image = await axios.get(
            `http://localhost:8080/patient/order/prescription-image/${order.prescriptionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );
          const imageUrl = URL.createObjectURL(image.data);
          return {
            ...order,
            prescriptionImage: imageUrl,
          };
        })
      );
      setDeliveredOrders(imageOrder);
      console.log(imageOrder);
    } catch (error) {
      console.log(error);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-staff");
      }
    };

    checkAuth();
    fetchRejectedOrders();
    fetchPendingOrders();
    fetchDeliveredOrders();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-6 pt-20">
      {/* Custom Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 transition-all duration-300 ${
            notification.type === "success"
              ? "bg-[#0cbe30] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="text-lg">
            {notification.type === "success" ? "✓" : "✕"}
          </span>
          <p>{notification.message}</p>
        </div>
      )}

      {/* Header with Tabs */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#006A71] mb-6">
          Prescription Orders
        </h1>
        <div className="flex space-x-2 border-b border-[#9ACBD0]">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-3 px-6 font-medium transition-all duration-200 relative ${
              activeTab === "pending"
                ? "text-[#006A71]"
                : "text-gray-500 hover:text-[#48A6A7]"
            }`}
          >
            Pending
            {pendingOrders.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#006A71] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {pendingOrders.length}
              </span>
            )}
            {activeTab === "pending" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006A71] rounded-t-md"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`py-3 px-6 font-medium transition-all duration-200 relative ${
              activeTab === "rejected"
                ? "text-[#006A71]"
                : "text-gray-500 hover:text-[#48A6A7]"
            }`}
          >
            Rejected
            {rejectedOrders.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#006A71] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {rejectedOrders.length}
              </span>
            )}
            {activeTab === "rejected" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006A71] rounded-t-md"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`py-3 px-6 font-medium transition-all duration-200 relative ${
              activeTab === "delivered"
                ? "text-[#006A71]"
                : "text-gray-500 hover:text-[#48A6A7]"
            }`}
          >
            Delivered
            {deliveredOrders.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#006A71] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {deliveredOrders.length}
              </span>
            )}
            {activeTab === "delivered" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#006A71] rounded-t-md"></span>
            )}
          </button>
        </div>
      </div>

      {/* Orders Display */}
      <div className="mt-6">
        {/* Pending Orders */}
        {activeTab === "pending" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#9ACBD0]"
                >
                  <div className="p-4 bg-[#9ACBD0] bg-opacity-10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#006A71]">
                        Order #{order.orderId}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-[#006A71] truncate">
                      {order.prescriptionTitle}
                    </h3>
                  </div>

                  <div className="p-4">
                    <div className="flex mb-4">
                      <div className="w-1/2 pr-2">
                        <img
                          src={order.prescriptionImage}
                          alt="Prescription"
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="w-1/2 pl-2 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-[#48A6A7]">
                              Prescription ID:
                            </span>
                            <span className="ml-1">{order.prescriptionId}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-[#48A6A7]">
                              Patient ID:
                            </span>
                            <span className="ml-1">{order.patientId}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-[#48A6A7]">
                              Patient Name:
                            </span>
                            <span className="ml-1">{order.patientName}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        onClick={() => navigate(`/order/read/${order.orderId}`)}
                        className="py-2 bg-[#48A6A7] text-white rounded-lg hover:bg-[#006A71] transition-colors duration-200"
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-[#9ACBD0] bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#48A6A7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">
                  No pending orders at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rejected Orders */}
        {activeTab === "rejected" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rejectedOrders.length > 0 ? (
              rejectedOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border-l-4 border-red-400"
                >
                  <div className="p-4 bg-red-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#006A71]">
                        Order #{order.orderId}
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Rejected
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-[#006A71] truncate">
                      {order.prescriptionTitle}
                    </h3>
                  </div>

                  <div className="p-4">
                    <div className="flex mb-4">
                      <div className="w-1/2 pr-2">
                        <img
                          src={order.prescriptionImage}
                          alt="Prescription"
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-[#48A6A7]">
                            Prescription ID:
                          </span>
                          <span className="ml-1">{order.prescriptionId}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-[#48A6A7]">
                            Patient ID:
                          </span>
                          <span className="ml-1">{order.patientId}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-[#48A6A7]">
                            Patient Name:
                          </span>
                          <span className="ml-1">{order.patientName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => navigate(`/order/view/${order.orderId}`)}
                      className="py-2 bg-[#48A6A7] text-white rounded-lg hover:bg-[#006A71] transition-colors duration-200 mb-5 ml-5"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">
                  No rejected orders to display.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Delivered Orders */}
        {activeTab === "delivered" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deliveredOrders.length > 0 ? (
              deliveredOrders.map((order, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-md border-l-4 border-green-400"
                >
                  <div className="p-4 bg-green-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#006A71]">
                        Order #{order.orderId}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Delivered
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-[#006A71] truncate">
                      {order.prescriptionTitle}
                    </h3>
                  </div>

                  <div className="p-4">
                    <div className="flex mb-4">
                      <div className="w-1/2 pr-2">
                        <img
                          src={order.prescriptionImage}
                          alt="Prescription"
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-[#48A6A7]">
                            Prescription ID:
                          </span>
                          <span className="ml-1">{order.prescriptionId}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-[#48A6A7]">
                            Patient ID:
                          </span>
                          <span className="ml-1">{order.patientId}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-[#48A6A7]">
                            Patient Name:
                          </span>
                          <span className="ml-1">{order.patientName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => navigate(`/order/view/${order.orderId}`)}
                      className="py-2 bg-[#48A6A7] text-white rounded-lg hover:bg-[#006A71] transition-colors duration-200 mb-5 ml-5"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">
                  No delivered orders to display.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
