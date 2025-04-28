import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreatePrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [pharmacyOrder, setPharmacyOrder] = useState({});
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleChange = (e) => {
    setPharmacyOrder({
      ...pharmacyOrder,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFile(file);

    // Create preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const order = {
        prescription: {
          prescriptionTitle: pharmacyOrder.prescriptionTitle,
        },
      };

      const formData = new FormData();
      formData.append(
        "pharmacyOrder",
        new Blob([JSON.stringify(order)], { type: "application/json" })
      );
      formData.append("file", file);

      const response = await axios.post(
        `http://localhost:8080/patient/order/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification({
        show: true,
        type: "success",
        message: "Order created successfully!",
      });

      // Clear form
      setPharmacyOrder({ prescriptionTitle: "" });
      setFile(null);
      setPreview(null);

      // Refresh orders
      fetchAllOrders();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.log(error);
      setNotification({
        show: true,
        type: "error",
        message: "Error creating order. Please try again.",
      });

      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patient/all-orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const presImage = await Promise.all(
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

      setOrders(presImage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    fetchAllOrders();

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate, id]);

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-12 px-4 sm:px-6 lg:px-8 pt-20">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm ${
            notification.type === "success"
              ? "bg-[#48A6A7] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p>{notification.message}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#006A71] mb-8 text-center">
          Create Prescription Order
        </h1>

        {/* Order Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <form onSubmit={handleOrder} className="space-y-6">
            <div>
              <label
                htmlFor="prescriptionTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prescription Title
              </label>
              <input
                type="text"
                name="prescriptionTitle"
                id="prescriptionTitle"
                placeholder="Enter prescription title"
                value={pharmacyOrder.prescriptionTitle || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prescription Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#9ACBD0] rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-[#48A6A7] mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <p className="text-xs text-gray-500">
                      Upload prescription image
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                    accept="image/*"
                    required
                  />
                </label>

                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-[#9ACBD0]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#006A71] hover:bg-[#48A6A7] text-white font-bold py-3 px-4 rounded-md transition duration-300"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>

        {/* My Orders */}
        <div>
          <h2 className="text-2xl font-bold text-[#006A71] mb-6">My Orders</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order.prescriptionId}
                  className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-[#48A6A7] transition-transform duration-300 hover:translate-y-[-5px]"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#006A71] mb-2">
                      {order.prescriptionTitle}
                    </h3>

                    <div className="relative aspect-square overflow-hidden mb-3 bg-[#F2EFE7] rounded-md">
                      <img
                        src={order.prescriptionImage}
                        alt="Prescription"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${
                          order.orderStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.orderStatus === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
