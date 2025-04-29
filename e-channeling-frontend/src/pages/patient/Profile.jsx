import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

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

  const fetchYserProfileData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patient/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      setProfile(userData);

      const imageUrl = await axios.get(
        `http://localhost:8080/public/get-profile-image/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const imageData = URL.createObjectURL(imageUrl.data);
      setImage(imageData);
      console.log(imageData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/patient/my-appointments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setAppointments(data);
      console.log(data);
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

    fetchYserProfileData();
    fetchAppointments();
    fetchAllOrders();

    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Recent activities - would normally come from an API
  const recentActivities = [
    {
      id: 1,
      type: "Lab Test",
      date: "Apr 15, 2025",
      status: "Results Available",
      with: "City Labs",
    },
    {
      id: 2,
      type: "Prescription",
      date: "Apr 10, 2025",
      status: "Refilled",
      with: "Dr. Williams",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profile Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-md transform transition duration-500 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-[#006A71] border-b border-[#9ACBD0] pb-2 mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center border-b border-gray-100 pb-3">
                    <div className="bg-[#9ACBD0] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-[#006A71]"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Full Name</span>
                      <p className="font-medium">
                        {profile.profileName || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center border-b border-gray-100 pb-3">
                    <div className="bg-[#9ACBD0] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-[#006A71]"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone</span>
                      <p className="font-medium">
                        {profile.phone || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center border-b border-gray-100 pb-3">
                    <div className="bg-[#9ACBD0] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-[#006A71]"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email</span>
                      <p className="font-medium">
                        {profile.profileEmail || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-[#9ACBD0] p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 text-[#006A71]"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Address</span>
                      <p className="font-medium">
                        {profile.address || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-2xl p-6 shadow-md mt-4 transform transition duration-500 hover:shadow-lg">
                <h3 className="text-xl font-semibold text-[#006A71] border-b border-[#9ACBD0] pb-2 mb-4">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-3"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            activity.type === "Appointment"
                              ? "bg-[#9ACBD0]"
                              : activity.type === "Lab Test"
                              ? "bg-blue-100"
                              : "bg-green-100"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 text-[#006A71]"
                          >
                            {activity.type === "Appointment" ? (
                              <>
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </>
                            ) : activity.type === "Lab Test" ? (
                              <>
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                              </>
                            ) : (
                              <>
                                <path d="M21 10h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"></path>
                                <path d="M5 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
                                <path d="M13 2h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
                              </>
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <span className="text-sm text-gray-500">
                            with {activity.with}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {activity.date}
                        </span>
                        <p
                          className={`text-sm font-medium ${
                            activity.status === "Completed"
                              ? "text-green-600"
                              : activity.status === "Results Available"
                              ? "text-blue-600"
                              : "text-[#48A6A7]"
                          }`}
                        >
                          {activity.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-1">
              {/* User Role Card */}
              <div className="bg-white rounded-2xl p-6 shadow-md transform transition duration-500 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#006A71]">Role</h3>
                  <span className="bg-[#9ACBD0] text-[#006A71] px-3 py-1 rounded-full text-sm font-medium">
                    {profile.role || "Patient"}
                  </span>
                </div>

                <div className="mt-4 bg-[#F2EFE7] rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    Access Level: <span className="font-medium">Standard</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Account Status:{" "}
                    <span className="font-medium text-green-600">Active</span>
                  </p>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl p-6 shadow-md mt-4 transform transition duration-500 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-[#006A71] mb-4">
                  Upcoming Appointments
                </h3>

                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.appointmentId}
                        className="bg-[#F2EFE7] rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#006A71]">
                            {appointment.schedule?.date || "Date not available"}
                          </span>
                          <span className="bg-[#9ACBD0] text-[#006A71] px-2 py-1 rounded-full text-xs">
                            #{appointment.appointmentId}
                          </span>
                        </div>
                        <p className="font-medium">
                          Dr. {appointment.doctor?.doctorName || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.doctor?.specialization ||
                            "Specialty not available"}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            Queue:{" "}
                            <span className="font-medium">
                              {appointment.queue?.queueNumber || "N/A"}
                            </span>
                          </span>
                          <span className="text-xs font-medium text-[#48A6A7]">
                            {appointment.appointmentStatus ||
                              "Status not available"}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            navigate(
                              `/patient/appointment/queue/${id}/${appointment.appointmentId}/${appointment.doctor.doctorId}`
                            )
                          }
                          className="w-full mt-3 py-2 bg-[#48A6A7] text-white text-sm rounded-lg hover:bg-[#006A71] transition-colors"
                        >
                          Queue Status
                        </button>
                      </div>
                    ))}

                    {appointments.length > 2 && (
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className="w-full py-2 bg-[#F2EFE7] text-[#006A71] text-sm rounded-lg hover:bg-[#9ACBD0] transition-colors"
                      >
                        View All Appointments
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <button className="mt-2 py-2 px-4 bg-[#9ACBD0] text-[#006A71] text-sm rounded-lg hover:bg-[#48A6A7] hover:text-white transition-colors">
                      Schedule Now
                    </button>
                  </div>
                )}
              </div>

              {/* Health Metrics */}
              <div className="bg-white rounded-2xl p-6 shadow-md mt-4 transform transition duration-500 hover:shadow-lg">
                <h3 className="text-lg font-semibold text-[#006A71] mb-4">
                  Quick Health Stats
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Checkup</span>
                    <span className="text-sm font-medium">April 10, 2025</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Blood Type</span>
                    <span className="text-sm font-medium">O+</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Allergies</span>
                    <span className="text-sm font-medium">Penicillin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "appointments":
        return (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-[#006A71] border-b border-[#9ACBD0] pb-2 mb-4">
              My Appointments
            </h3>

            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.appointmentId}
                    className="bg-[#F2EFE7] rounded-lg p-4 border-l-4 border-[#48A6A7] hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#9ACBD0] text-[#006A71] font-medium px-3 py-1 rounded-full text-sm">
                          #{appointment.appointmentId}
                        </span>
                        <span className="bg-white text-[#006A71] font-medium px-3 py-1 rounded-full text-sm">
                          {appointment.appointmentStatus}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Queue:{" "}
                        <span className="font-medium">
                          {appointment.queue?.queueNumber || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="font-medium text-lg text-[#006A71]">
                        Dr. {appointment.doctor?.doctorName || "Unknown"}
                      </div>
                      <div className="text-sm text-[#48A6A7]">
                        {appointment.doctor?.specialization ||
                          "Specialty not available"}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {appointment.schedule?.date || "Date not available"}
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/patient/appointment/queue/${id}/${appointment.appointmentId}/${appointment.doctor.doctorId}`
                          )
                        }
                        className="bg-[#48A6A7] hover:bg-[#006A71] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Queue Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "records":
        return (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-[#006A71] border-b border-[#9ACBD0] pb-2 mb-4">
              Medical Records
            </h3>
            <p className="text-gray-500 text-center py-12">
              Medical records will be displayed here
            </p>
          </div>
        );
      case "prescriptions":
        return (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#006A71] border-b border-[#9ACBD0] pb-2 mb-4">
                  No Orders Yet
                </h3>
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Profile Section with Custom Design */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Curved teal banner with pattern */}
          <div className="h-40 bg-[#48A6A7] relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 60%, rgba(0, 106, 113, 0.4) 0%, transparent 25%), 
                              radial-gradient(circle at 75% 30%, rgba(0, 106, 113, 0.4) 0%, transparent 25%)`,
              }}
            ></div>
          </div>

          {/* Profile content */}
          <div className="relative px-6 py-8">
            {/* Avatar with decorative ring */}
            <div className="absolute -top-16 left-8 sm:left-12">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9ACBD0] to-[#006A71] p-1 transform rotate-45"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#006A71] to-[#9ACBD0] p-1 animate-pulse"></div>
                <div className="relative h-32 w-32 rounded-full border-4 border-white bg-[#9ACBD0] overflow-hidden shadow-xl">
                  {image ? (
                    <img
                      src={image}
                      alt={profile.profileName || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#006A71]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile header */}
            <div className="ml-44 sm:ml-48">
              <h2 className="text-3xl font-bold text-[#006A71]">
                {profile.profileName || "User Profile"}
              </h2>
              <div className="flex items-center mt-1">
                <span className="bg-[#9ACBD0] text-[#006A71] px-3 py-1 rounded-full text-sm font-medium mr-2">
                  {profile.role || "Patient"}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {profile.profileEmail || "Email not available"}
              </p>
            </div>

            {/* Status indicators */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#F2EFE7] rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 block">Patient ID</span>
                <span className="font-medium text-[#006A71]">
                  {id || "Unknown"}
                </span>
              </div>
              <div className="bg-[#F2EFE7] rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 block">
                  Registration Date
                </span>
                <span className="font-medium text-[#006A71]">Jan 15, 2025</span>
              </div>
              <div className="bg-[#F2EFE7] rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 block">
                  Appointments
                </span>
                <span className="font-medium text-[#006A71]">
                  {appointments.length}
                </span>
              </div>
              <div className="bg-[#F2EFE7] rounded-xl p-3 text-center">
                <span className="text-xs text-gray-500 block">
                  Primary Doctor
                </span>
                <span className="font-medium text-[#006A71]">
                  {appointments.length > 0
                    ? `Dr. ${appointments[0].doctor.doctorName}`
                    : "Not assigned"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md p-1 flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-[#48A6A7] text-white"
                : "hover:bg-[#F2EFE7] text-gray-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "appointments"
                ? "bg-[#48A6A7] text-white"
                : "hover:bg-[#F2EFE7] text-gray-600"
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "records"
                ? "bg-[#48A6A7] text-white"
                : "hover:bg-[#F2EFE7] text-gray-600"
            }`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "prescriptions"
                ? "bg-[#48A6A7] text-white"
                : "hover:bg-[#F2EFE7] text-gray-600"
            }`}
          >
            Prescriptions Orders
          </button>
        </div>

        {/* Dynamic Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;
