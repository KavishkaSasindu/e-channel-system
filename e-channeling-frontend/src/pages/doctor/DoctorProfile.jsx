import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Heart,
  CheckCircle,
  Loader,
  AlertCircle,
  X,
} from "lucide-react";
import { AuthContext } from "../common/AuthProvider";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    success: false,
    message: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const profileId = user?.profileId;

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/public/get-doctor-profile/${id}`
      );

      const data = response.data;
      setDoctor(data);
    } catch (error) {
      console.log("Error fetching doctor profile:", error.message);
    }
  };

  const fetchProfileImage = async () => {
    try {
      setImageError(false);
      const response = await axios.get(
        `http://localhost:8080/public/get-profile-image/${
          doctor.userProfile?.profileId || id
        }`,
        { responseType: "blob" }
      );

      if (response.data.size > 0) {
        const imageUrl = URL.createObjectURL(response.data);
        console.log("Image URL created:", imageUrl);
        setImage(imageUrl);
      } else {
        console.log("Received empty image data");
        setImageError(true);
      }
    } catch (error) {
      console.log("Error fetching profile image:", error);
      setImageError(true);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [id]);

  // Separate useEffect for image fetching that depends on doctor data
  useEffect(() => {
    if (doctor && doctor.userProfile && doctor.userProfile.profileId) {
      fetchProfileImage();
    }
  }, [doctor]);

  // Cleanup function for blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const handleBooking = async (scheduleId, doctorId) => {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        alert("You need to sign in to create an appointment");
        navigate("/login");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `http://localhost:8080/patient/appointment/${profileId}/${doctorId}/${scheduleId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      // Show success notification
      setNotification({
        show: true,
        success: true,
        message:
          "Appointment booked successfully. We've sent a confirmation email to your registered email address.",
        doctorName: doctor.userProfile?.profileName,
        date: doctor.schedules?.find((s) => s.scheduleId === scheduleId)?.date,
        time: `${formatTime(
          doctor.schedules?.find((s) => s.scheduleId === scheduleId)?.startTime
        )} - ${formatTime(
          doctor.schedules?.find((s) => s.scheduleId === scheduleId)?.endTime
        )}`,
        fee: doctor.consultationFee,
      });

      // Refresh doctor profile to update available slots
      fetchDoctorProfile();
    } catch (error) {
      console.log("Booking error:", error);
      // Show error notification
      setNotification({
        show: true,
        success: false,
        message:
          error.response && error.response.data
            ? error.response.data
            : "Booking failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const handleImageError = () => {
    console.log("Image failed to load");
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto pt-15">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#006A71] h-32 relative"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row">
              <div className="relative -mt-16 md:w-1/4 flex justify-center">
                <div className="bg-[#9ACBD0] h-32 w-32 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                  {image && !imageError ? (
                    <img
                      src={image}
                      alt={doctor.userProfile?.profileName || "Doctor profile"}
                      className="h-full w-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {doctor.userProfile?.profileName?.charAt(0) || "D"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:w-3/4 md:pl-6">
                <h1 className="text-3xl font-bold text-[#006A71]">
                  Dr. {doctor.userProfile?.profileName}
                </h1>
                <div className="flex items-center mt-1 text-[#48A6A7]">
                  <Heart size={18} className="mr-1" />
                  <span>{doctor.specialization?.specializationName}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-600">
                  <Award size={18} className="mr-1" />
                  <span>{doctor.qualification}</span>
                </div>
                <p className="mt-3 text-gray-700">
                  {doctor.specialization?.specializationDescription}
                </p>

                <div className="mt-6 p-4 bg-[#F2EFE7] rounded-lg">
                  <h3 className="font-semibold text-[#006A71] mb-2">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-[#48A6A7] mr-2" />
                      <span className="text-sm">
                        {doctor.userProfile?.profileEmail}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-[#48A6A7] mr-2" />
                      <span className="text-sm">
                        {doctor.userProfile?.phone}
                      </span>
                    </div>
                    <div className="flex items-center col-span-1 md:col-span-2">
                      <MapPin size={16} className="text-[#48A6A7] mr-2" />
                      <span className="text-sm">
                        {doctor.userProfile?.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Fee Card */}
            <div className="mt-6 bg-[#9ACBD0] bg-opacity-20 p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#006A71]">
                  Consultation Fee
                </h3>
                <p className="text-gray-600">Per session</p>
              </div>
              <div className="text-xl font-bold text-[#006A71]">
                Rs. {doctor.consultationFee}
              </div>
            </div>
          </div>
        </div>

        {/* Schedules Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#006A71] mb-4">
            Available Schedules
          </h2>

          {doctor.schedules && doctor.schedules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-[#9ACBD0]"
                >
                  <div className="bg-[#48A6A7] py-3 px-4">
                    <div className="flex items-center text-white">
                      <Calendar size={20} className="mr-2" />
                      <span className="font-medium">
                        {schedule.dayOfWeek}, {formatDate(schedule.date)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center text-gray-700 mb-3">
                      <Clock size={18} className="mr-2 text-[#48A6A7]" />
                      <span>
                        {formatTime(schedule.startTime)} -{" "}
                        {formatTime(schedule.endTime)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{schedule.capacity}</span>{" "}
                        slots available
                      </div>
                      <button
                        onClick={() =>
                          handleBooking(schedule.scheduleId, doctor.doctorId)
                        }
                        disabled={loading}
                        className={`${
                          loading
                            ? "bg-gray-400"
                            : "bg-[#006A71] hover:bg-[#004e52]"
                        } transition-colors text-white py-2 px-4 rounded-md`}
                      >
                        {loading ? "Processing..." : "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-600">
                No schedules available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading Box */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <Loader size={40} className="text-[#48A6A7] animate-spin mb-4" />
            <p className="text-[#006A71] font-medium">Booking...</p>
          </div>
        </div>
      )}

      {/* Centered Popup Notification */}
      {notification.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md mx-4">
            <div
              className={`p-4 ${
                notification.success ? "bg-[#48A6A7]" : "bg-red-700"
              } text-white flex justify-between items-center rounded-t-lg`}
            >
              <div className="flex items-center">
                {notification.success ? (
                  <CheckCircle size={24} className="mr-2" />
                ) : (
                  <AlertCircle size={24} className="mr-2" />
                )}
                <h2 className="text-lg font-medium">
                  {notification.success
                    ? "Booking Confirmed"
                    : "Booking Failed"}
                </h2>
              </div>
              <button
                onClick={closeNotification}
                className="text-white hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">{notification.message}</p>

              {notification.success && (
                <div className="bg-[#F2EFE7] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#006A71] mb-3">
                    Appointment Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">{notification.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{notification.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-medium">Rs. {notification.fee}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={closeNotification}
                className="w-full bg-[#006A71] hover:bg-[#004e52] text-white py-2 px-4 rounded-md transition-colors"
              >
                {notification.success ? "Done" : "Try Again"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when notification is shown */}
      {notification.show && (
        <div
          className="fixed inset-0 backdrop-filter backdrop-blur-[2px] z-40"
          onClick={closeNotification}
        ></div>
      )}

      {/* Overlay when loading */}
      {loading && (
        <div className="fixed inset-0 backdrop-filter backdrop-blur-[2px] z-40"></div>
      )}
    </div>
  );
};

export default DoctorProfile;
