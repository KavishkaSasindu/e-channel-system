import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Loader } from "lucide-react";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useParams();
  const [order, setOrder] = useState();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log(data);

      const image = await axios.get(
        `http://localhost:8080/patient/order/prescription-image/${data.prescriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(image.data);
      setImage(imageUrl);
      setOrder(data);
      console.log(data);
      console.log(image.data);
    } catch (error) {
      console.log(error);
      showNotification("Error loading order details", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const approveOrder = async (orderId) => {
    setApproveLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/staff/order/approved/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("successfully approved order");
        showNotification("Order successfully approved", "success");
        fetchOrder(); // Refresh order data
      }
    } catch (error) {
      console.log(error);
      showNotification("Error approving order", "error");
    } finally {
      setApproveLoading(false);
    }
  };

  const rejectOrder = async (orderId) => {
    setRejectLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/staff/order/reject/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("successfully rejected order");
        showNotification("Order successfully rejected", "error");
        fetchOrder(); // Refresh order data
      }
    } catch (error) {
      console.log(error);
      showNotification("Error rejecting order", "error");
    } finally {
      setRejectLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-staff");
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] pt-30 px-6 md:px-12">
      <Link
        to="/orders"
        className="inline-flex items-center text-[#006A71] font-medium hover:text-[#48A6A7] transition-colors mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to All Orders
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader size={40} className="animate-spin text-[#48A6A7]" />
            <p className="mt-4 text-[#006A71] font-medium">
              Loading order details...
            </p>
          </div>
        </div>
      ) : order ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-[#9ACBD0] border-b border-[#48A6A7]">
            <h1 className="text-2xl font-bold text-[#006A71]">Order Details</h1>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Prescription Image */}
            <div className="lg:w-1/2 p-6 flex justify-center items-center bg-white">
              {image ? (
                <div className="relative w-full flex justify-center">
                  <img
                    src={image}
                    alt="Prescription"
                    className="w-full  rounded-lg shadow-md object-contain h-[550px]"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 w-full bg-gray-100 rounded-lg">
                  <p className="text-gray-500">
                    No prescription image available
                  </p>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="lg:w-1/2 p-6 bg-white">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Order Information
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#F2EFE7] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.orderId}
                    </p>
                  </div>

                  <div className="bg-[#F2EFE7] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Prescription ID</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.prescriptionId}
                    </p>
                  </div>

                  <div className="bg-[#F2EFE7] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Prescription Title</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.prescriptionTitle || "No title"}
                    </p>
                  </div>

                  <div className="bg-[#F2EFE7] p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Patient Name</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {order.patientName}
                    </p>
                  </div>
                </div>

                {notification.show && (
                  <div
                    className={`py-2 px-3 rounded-lg text-center w-full mt-3 ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {notification.message}
                  </div>
                )}

                {order.orderStatus === "PENDING" && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-gray-600">
                      Update order status:
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => approveOrder(order.orderId)}
                        disabled={approveLoading || rejectLoading}
                        className="flex-1 bg-[#48A6A7] hover:bg-[#006A71] text-white py-2 px-4 rounded-md flex justify-center items-center transition-colors disabled:opacity-70 text-sm"
                      >
                        {approveLoading ? (
                          <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                          <Check size={16} className="mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => rejectOrder(order.orderId)}
                        disabled={approveLoading || rejectLoading}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex justify-center items-center transition-colors disabled:opacity-70 text-sm"
                      >
                        {rejectLoading ? (
                          <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                          <X size={16} className="mr-2" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-600">No order found with the provided ID.</p>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
