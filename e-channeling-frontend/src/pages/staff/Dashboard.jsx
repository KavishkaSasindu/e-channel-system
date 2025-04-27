import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/public/all-doctors"
      );

      const data = response.data;
      setDoctors(data);
      console.log(data);
    } catch (error) {
      console.group(error.message);
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
    fetchAllDoctors();

    window.addEventListener("storage", checkAuth);
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) =>
      prev === Math.ceil(doctors.length / 3) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? Math.ceil(doctors.length / 3) - 1 : prev - 1
    );
  };

  // Generate placeholder avatar based on name
  const getInitials = (name) => {
    if (!name) return "DR";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F2EFE7" }}>
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b"
            style={{ borderColor: "#9ACBD0" }}
          >
            <h1
              className="text-4xl font-bold mb-4 md:mb-0"
              style={{ color: "#006A71" }}
            >
              Dashboard
            </h1>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: "#48A6A7" }}
                onClick={() => navigate("/staff/profile")}
              >
                My Profile
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: "#006A71" }}
                onClick={() => navigate("/staff/settings")}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Welcome Section */}
          <div
            className="mb-10 p-6 rounded-lg"
            style={{ backgroundColor: "#9ACBD0", color: "#006A71" }}
          >
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to the Staff Dashboard
            </h2>
            <p className="text-lg">
              Here you can manage your tasks and view important information.
            </p>
          </div>

          {/* Doctors List Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#006A71" }}
              >
                Doctors List
              </h2>
              <Link to="/staff/dashboard/add-doctor">
                <button
                  className="flex items-center px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: "#006A71" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Doctor
                </button>
              </Link>
            </div>

            {/* Doctors Carousel */}
            <div className="relative">
              {/* Carousel Navigation */}
              {doctors.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md"
                    style={{ color: "#006A71" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md"
                    style={{ color: "#006A71" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Carousel Content */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {doctors.length > 0 ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                      {doctors.map((doctor, index) => (
                        <div
                          key={index}
                          className="flex-none w-full md:w-auto transform transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div
                            className="bg-white rounded-xl overflow-hidden shadow-md border"
                            style={{ borderColor: "#9ACBD0" }}
                          >
                            {/* Doctor Avatar */}
                            <div
                              className="h-32 flex items-center justify-center"
                              style={{ backgroundColor: "#48A6A7" }}
                            >
                              <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
                                style={{ backgroundColor: "#006A71" }}
                              >
                                {getInitials(doctor.userProfile?.profileName)}
                              </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="p-4">
                              <h3
                                className="text-lg font-semibold mb-1"
                                style={{ color: "#006A71" }}
                              >
                                {doctor.userProfile?.profileName ||
                                  "Doctor Name"}
                              </h3>
                              <p
                                className="text-sm mb-2"
                                style={{ color: "#48A6A7" }}
                              >
                                {doctor.specialization?.specializationName ||
                                  "Specialization"}
                              </p>
                              <p
                                className="text-xs mb-3"
                                style={{ color: "#006A71" }}
                              >
                                {doctor.qualification || "Qualification"}
                              </p>

                              <div className="flex justify-between items-center">
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "#006A71" }}
                                >
                                  ₹{doctor.consultationFee || "N/A"}
                                </span>
                                <span
                                  className="px-2 py-1 rounded-full text-xs"
                                  style={{
                                    backgroundColor: doctor.available
                                      ? "#9ACBD0"
                                      : "#F2EFE7",
                                    color: "#006A71",
                                  }}
                                >
                                  {doctor.available
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              </div>

                              <div
                                className="mt-4 pt-4 border-t flex justify-between"
                                style={{ borderColor: "#F2EFE7" }}
                              >
                                <button
                                  className="px-3 py-1 rounded text-sm"
                                  style={{
                                    backgroundColor: "#F2EFE7",
                                    color: "#006A71",
                                  }}
                                  onClick={() =>
                                    navigate(`/staff/doctor/${doctor.id}`)
                                  }
                                >
                                  View Profile
                                </button>
                                <button
                                  className="px-3 py-1 rounded text-sm text-white"
                                  style={{ backgroundColor: "#48A6A7" }}
                                  onClick={() =>
                                    navigate(`/staff/edit-doctor/${doctor.id}`)
                                  }
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="w-full text-center py-12"
                      style={{ color: "#006A71" }}
                    >
                      <p className="text-lg">
                        No doctors found. Add your first doctor to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Carousel Indicators */}
              {doctors.length > 3 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: Math.ceil(doctors.length / 3) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          activeSlide === index ? "w-6" : ""
                        }`}
                        style={{
                          backgroundColor:
                            activeSlide === index ? "#006A71" : "#9ACBD0",
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Patient List Section */}
          <div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: "#006A71" }}
            >
              Patient List
            </h2>
            <div
              className="bg-white p-6 rounded-lg shadow-sm border"
              style={{ borderColor: "#9ACBD0" }}
            >
              {/* rest of content for patient list would go here */}
              <p className="text-center py-4" style={{ color: "#48A6A7" }}>
                Patient management system coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
