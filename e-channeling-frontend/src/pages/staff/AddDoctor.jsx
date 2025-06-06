import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddDoctor = () => {
  const navigate = useNavigate();

  const initialSchedule = {
    dayOfWeek: "MONDAY",
    date: "",
    startTime: "",
    endTime: "",
    available: true,
    capacity: 6,
  };

  const [doctor, setDoctor] = useState({
    consultationFee: 2500.0,
    qualification: "MBBS, Specialization",
    specialization: {
      specializationName: "Cardiology",
      specializationDescription:
        "medical specialty focused on diagnosing and treating disorders of the heart and cardiovascular system",
    },
    available: true, // Predefined as true
    schedules: [],
    userProfile: {
      profileName: "",
      profileEmail: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const [currentSchedule, setCurrentSchedule] = useState(initialSchedule);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [responseMessage, setResponseMessage] = useState({
    text: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      specialization: { ...prev.specialization, [name]: value },
    }));
  };

  const handleUserProfileChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, [name]: value },
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSchedule((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addSchedule = () => {
    if (
      currentSchedule.date &&
      currentSchedule.startTime &&
      currentSchedule.endTime
    ) {
      setDoctor((prev) => ({
        ...prev,
        schedules: [...prev.schedules, currentSchedule],
      }));
      setCurrentSchedule(initialSchedule);
      setResponseMessage({
        text: "Schedule added successfully!",
        type: "success",
      });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setResponseMessage({ text: "", type: "" });
      }, 3000);
    } else {
      setResponseMessage({
        text: "Please fill all schedule fields",
        type: "error",
      });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setResponseMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setResponseMessage({
          text: "Image size should be less than 2MB",
          type: "error",
        });

        // Clear the message after 3 seconds
        setTimeout(() => {
          setResponseMessage({ text: "", type: "" });
        }, 3000);
        return;
      }

      setProfileImage(file);
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setResponseMessage({
        text: "Image uploaded successfully!",
        type: "success",
      });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setResponseMessage({ text: "", type: "" });
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !doctor.userProfile.profileName ||
      !doctor.userProfile.profileEmail ||
      !doctor.userProfile.password
    ) {
      setResponseMessage({
        text: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    try {
      setResponseMessage({
        text: "Processing submission...",
        type: "info",
      });

      console.log(doctor);
      const formData = new FormData();
      formData.append(
        "doctor",
        new Blob([JSON.stringify(doctor)], { type: "application/json" })
      );
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/staff/create-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      console.log(response);
      if (response.status === 201) {
        setResponseMessage({
          text: "Doctor added successfully!",
          type: "success",
        });
        setTimeout(() => {
          navigate("/staff/dashboard");
        }, 2000);
      } else {
        setResponseMessage({
          text: "Failed to add doctor. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error.message);
      setResponseMessage({
        text: error.message || "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-staff");
      }
    };

    // Initial check
    checkAuth();

    // Listen for token changes across tabs/windows
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      {/* Response Message Box */}
      {responseMessage.text && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 py-3 px-6 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            responseMessage.type === "success"
              ? "bg-green-500"
              : responseMessage.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {responseMessage.text}
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-10">
        <div
          className="py-6 px-8 text-white"
          style={{ backgroundColor: "#006A71" }}
        >
          <h1 className="text-3xl font-bold">Doctor Registration</h1>
          <p className="mt-2" style={{ color: "#9ACBD0" }}>
            Add a new healthcare professional to your system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <div className="mb-8">
                <h2
                  className="text-xl font-semibold mb-6 pb-2 border-b-2"
                  style={{ borderColor: "#48A6A7", color: "#006A71" }}
                >
                  Professional Details
                </h2>

                {/* Enhanced Image Upload Section */}
                <div className="mb-6">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#006A71" }}
                  >
                    Profile Image
                  </label>
                  <div className="flex flex-col items-center">
                    {imagePreview ? (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="h-40 w-40 object-cover rounded-full border-4"
                          style={{ borderColor: "#48A6A7" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfileImage(null);
                            setImagePreview(null);
                            setResponseMessage({
                              text: "Image removed",
                              type: "info",
                            });
                            setTimeout(() => {
                              setResponseMessage({ text: "", type: "" });
                            }, 3000);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        className="h-40 w-40 mb-4 flex items-center justify-center bg-gray-100 rounded-full border-4"
                        style={{ borderColor: "#48A6A7" }}
                      >
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="w-full">
                      <label
                        htmlFor="profile-upload"
                        className="cursor-pointer py-2 px-4 w-full text-center block rounded-lg text-white transition duration-300"
                        style={{ backgroundColor: "#48A6A7" }}
                      >
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        name="profileImage"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Consultation Fee (Rs)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={doctor.consultationFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={doctor.qualification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Specialization Name
                  </label>
                  <input
                    type="text"
                    name="specializationName"
                    value={doctor.specialization.specializationName}
                    onChange={handleSpecializationChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Specialization Description
                  </label>
                  <textarea
                    name="specializationDescription"
                    value={doctor.specialization.specializationDescription}
                    onChange={handleSpecializationChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    onChange={() => {}}
                    disabled
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ color: "#48A6A7" }}
                  />
                  <label
                    className="ml-2 block text-sm"
                    style={{ color: "#006A71" }}
                  >
                    Available
                  </label>
                </div>
              </div>

              <div>
                <h2
                  className="text-xl font-semibold mb-6 pb-2 border-b-2"
                  style={{ borderColor: "#48A6A7", color: "#006A71" }}
                >
                  Profile Information
                </h2>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="profileName"
                    value={doctor.userProfile.profileName}
                    onChange={handleUserProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="profileEmail"
                    value={doctor.userProfile.profileEmail}
                    onChange={handleUserProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={doctor.userProfile.password}
                    onChange={handleUserProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={doctor.userProfile.phone}
                    onChange={handleUserProfileChange}
                    placeholder="123-4567-890"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#006A71" }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={doctor.userProfile.address}
                    onChange={handleUserProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-8">
                <h2
                  className="text-xl font-semibold mb-6 pb-2 border-b-2"
                  style={{ borderColor: "#48A6A7", color: "#006A71" }}
                >
                  Add Schedule
                </h2>

                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#006A71" }}
                    >
                      Day of Week
                    </label>
                    <select
                      name="dayOfWeek"
                      value={currentSchedule.dayOfWeek}
                      onChange={handleScheduleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    >
                      {[
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY",
                      ].map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#006A71" }}
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={currentSchedule.date}
                      onChange={handleScheduleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#006A71" }}
                      >
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={currentSchedule.startTime}
                        onChange={handleScheduleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                          boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#006A71" }}
                      >
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={currentSchedule.endTime}
                        onChange={handleScheduleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                          boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#006A71" }}
                    >
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={currentSchedule.capacity}
                      onChange={handleScheduleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addSchedule}
                    className="w-full py-2 px-4 rounded-lg text-white transition duration-300"
                    style={{
                      backgroundColor: "#48A6A7",
                      hover: { backgroundColor: "#006A71" },
                    }}
                  >
                    Add Schedule
                  </button>
                </div>
              </div>

              <div>
                <h2
                  className="text-xl font-semibold mb-4 pb-2 border-b-2"
                  style={{ borderColor: "#48A6A7", color: "#006A71" }}
                >
                  Current Schedules
                </h2>

                <div className="space-y-4 max-h-80 overflow-y-auto p-2">
                  {doctor.schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between">
                        <span
                          className="font-medium"
                          style={{ color: "#006A71" }}
                        >
                          Day: {schedule.dayOfWeek}
                        </span>
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: "#9ACBD0",
                            color: "#006A71",
                          }}
                        >
                          {schedule.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div
                        className="mt-2 grid grid-cols-3 gap-2 text-sm"
                        style={{ color: "#006A71" }}
                      >
                        <div>Date: {schedule.date}</div>
                        <div>
                          Time: {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div>Capacity: {schedule.capacity}</div>
                      </div>
                    </div>
                  ))}
                  {doctor.schedules.length === 0 && (
                    <p className="text-center py-4 text-gray-500">
                      No schedules added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="submit"
              className="py-3 px-8 font-medium rounded-lg transition duration-300 shadow-md text-white"
              style={{ backgroundColor: "#006A71" }}
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
