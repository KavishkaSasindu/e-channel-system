import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDoctor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profileId } = useParams();
  const token = localStorage.getItem("token");

  const initialSchedule = {
    scheduleId: null,
    dayOfWeek: "MONDAY",
    date: "",
    startTime: "",
    endTime: "",
    available: true,
    capacity: 6,
  };

  const [doctor, setDoctor] = useState({
    consultationFee: 0,
    qualification: "",
    specialization: {
      specializationName: "",
      specializationDescription: "",
    },
    available: true,
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
  const [loading, setLoading] = useState(true);

  const showMessage = (message, type) => {
    setResponseMessage({
      text: message,
      type: type,
    });
    setTimeout(() => {
      setResponseMessage({ text: "", type: "" });
    }, 3000);
  };

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/public/get-doctor-profile/${id}`
      );
      const data = response.data;

      // Important: Don't include the password in the state - it will be
      // masked or hashed in the response and shouldn't be sent back
      setDoctor({
        ...data,
        userProfile: {
          profileName: data.userProfile.profileName,
          profileEmail: data.userProfile.profileEmail,
          // Don't set password here - leave it empty
          password: "",
          phone: data.userProfile.phone || "",
          address: data.userProfile.address || "",
        },
        specialization: {
          specializationName: data.specialization.specializationName || "",
          specializationDescription:
            data.specialization.specializationDescription || "",
        },
        schedules: data.schedules
          ? data.schedules.map((schedule) => ({
              scheduleId: schedule.scheduleId, // Make sure to preserve the schedule ID if it exists
              dayOfWeek: schedule.dayOfWeek,
              date: schedule.date,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              capacity: schedule.capacity,
              available: schedule.available,
            }))
          : [],
      });

      try {
        // Only try to fetch image if profileId exists
        if (profileId) {
          const imageResponse = await axios.get(
            `http://localhost:8080/public/get-profile-image/${profileId}`,
            { responseType: "blob" }
          );

          if (imageResponse.data.size > 0) {
            const imageUrl = URL.createObjectURL(imageResponse.data);
            setImagePreview(imageUrl); // Only set image preview, not profileImage
          }
        }
      } catch (imageError) {
        console.log(
          "Image not found or error loading image:",
          imageError.message
        );
        // Don't show error to user - just continue without the image
      }

      setLoading(false);
    } catch (error) {
      console.log("Error fetching doctor details:", error.message);
      showMessage("Failed to load doctor details. Please try again.", "error");
      setLoading(false);
    }
  };

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

  // Check if a schedule is a duplicate before adding
  const isDuplicateSchedule = (newSchedule) => {
    return doctor.schedules.some(
      (existingSchedule) =>
        existingSchedule.date === newSchedule.date &&
        existingSchedule.startTime === newSchedule.startTime &&
        existingSchedule.endTime === newSchedule.endTime
    );
  };

  // Update the duplicate check in addSchedule function
  const addSchedule = () => {
    if (
      currentSchedule.date &&
      currentSchedule.startTime &&
      currentSchedule.endTime
    ) {
      // Check for duplicates using scheduleId
      const isDuplicate = doctor.schedules.some(
        (existing) =>
          // Check if it's the same schedule ID (for existing schedules)
          existing.scheduleId === currentSchedule.scheduleId ||
          // Check for overlapping time slots (for new schedules)
          (existing.date === currentSchedule.date &&
            existing.startTime === currentSchedule.startTime &&
            existing.endTime === currentSchedule.endTime)
      );

      if (isDuplicate) {
        showMessage("This schedule already exists!", "error");
        return;
      }

      setDoctor((prev) => ({
        ...prev,
        schedules: [...prev.schedules, currentSchedule],
      }));
      setCurrentSchedule(initialSchedule);
      showMessage("Schedule added successfully!", "success");
    } else {
      showMessage("Please fill all schedule fields", "error");
    }
  };

  const removeSchedule = (index) => {
    setDoctor((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
    showMessage("Schedule removed successfully!", "success");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showMessage("Image size should be less than 2MB", "error");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      showMessage("Image uploaded successfully!", "success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!doctor.userProfile.profileName || !doctor.userProfile.profileEmail) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    try {
      showMessage("Processing submission...", "info");

      // Create a data structure that matches what the backend expects
      const doctorData = {
        consultationFee: doctor.consultationFee,
        qualification: doctor.qualification,
        specialization: {
          specializationName: doctor.specialization.specializationName,
          specializationDescription:
            doctor.specialization.specializationDescription,
        },
        available: doctor.available,
        schedules: doctor.schedules
          ? doctor.schedules.map((schedule) => ({
              scheduleId: schedule.scheduleId, // Make sure to preserve the schedule ID if it exists
              dayOfWeek: schedule.dayOfWeek,
              date: schedule.date,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              capacity: schedule.capacity,
              available: schedule.available,
            }))
          : [],
        userProfile: {
          profileName: doctor.userProfile.profileName,
          profileEmail: doctor.userProfile.profileEmail,
          // Only include password if it's not empty
          ...(doctor.userProfile.password && {
            password: doctor.userProfile.password,
          }),
          phone: doctor.userProfile.phone,
          address: doctor.userProfile.address,
        },
      };

      const formData = new FormData();
      // Convert doctorData to a JSON string blob
      formData.append(
        "doctor",
        new Blob([JSON.stringify(doctorData)], { type: "application/json" })
      );

      // Only append image if user selected a new one
      if (profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }

      // For debugging
      console.log("Sending doctor data:", doctorData);

      const response = await axios.put(
        `http://localhost:8080/staff/update-doctor/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Let axios set content-type for multipart/form-data
          },
        }
      );

      console.log("Update response:", response);

      if (response.status === 201) {
        showMessage("Doctor updated successfully!", "success");
        setTimeout(() => {
          navigate("/staff/dashboard");
        }, 2000);
      } else {
        showMessage("Failed to update doctor. Please try again.", "error");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);

      // Show a more helpful error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "An error occurred. Please try again.";

      showMessage(errorMessage, "error");
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-staff");
      }
    };

    checkAuth();
    fetchDoctor();

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate, id, profileId]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F2EFE7" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: "#006A71" }}>
            Loading doctor details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundColor: "#F2EFE7" }}
    >
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
          <h1 className="text-3xl font-bold">Doctor Update</h1>
          <p className="mt-2" style={{ color: "#9ACBD0" }}>
            Update existing doctor details and schedules
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
                            showMessage("Image removed", "info");
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
                    onChange={(e) =>
                      setDoctor((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }))
                    }
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
                    Password (Leave blank to keep current password)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={doctor.userProfile.password}
                    onChange={handleUserProfileChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.2)" }}
                    placeholder="Leave blank to keep current password"
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
                    style={{ backgroundColor: "#48A6A7" }}
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
                  {doctor.schedules && doctor.schedules.length > 0 ? (
                    doctor.schedules.map((schedule, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeSchedule(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition duration-200"
                          title="Remove schedule"
                        >
                          ✕
                        </button>
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
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">
                      No schedules added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center flex justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/staff/dashboard")}
              className="py-3 px-8 font-medium rounded-lg transition duration-300 shadow-md text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-8 font-medium rounded-lg transition duration-300 shadow-md text-white"
              style={{ backgroundColor: "#006A71" }}
            >
              Update Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDoctor;
