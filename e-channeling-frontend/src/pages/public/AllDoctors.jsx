import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/public/all-doctors"
      );

      const data = response.data;
      setDoctors(data);
      if (data.length === 0) {
        console.log("No doctors found.");
      }
      console.log(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Generate unique specializations list for filter
  const specializations = [
    "All",
    ...new Set(
      doctors.map(
        (doctor) => doctor.specialization?.specializationName || "General"
      )
    ),
  ];

  // Filter doctors based on search term and specialization
  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch =
      doctor.userProfile?.profileName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) || false;
    const specializationMatch =
      selectedSpecialization === "All" ||
      doctor.specialization?.specializationName === selectedSpecialization;
    return nameMatch && specializationMatch;
  });

  // Generate avatar placeholder
  const getInitials = (name) => {
    if (!name) return "DR";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto pt-15">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#006A71" }}>
            All Doctors
          </h1>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: "#9ACBD0" }}
          ></div>
          <p className="mt-4 text-lg" style={{ color: "#48A6A7" }}>
            Find the right healthcare professional for your needs
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search doctors by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                borderColor: "#9ACBD0",
                boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.1)",
              }}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#48A6A7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full md:w-auto pl-4 pr-10 py-3 rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                borderColor: "#9ACBD0",
                boxShadow: "0 0 0 3px rgba(72, 166, 167, 0.1)",
                color: "#006A71",
              }}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="mt-15">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin"
                style={{ borderColor: "#9ACBD0", borderTopColor: "#006A71" }}
              ></div>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <Link to={`/doctor/${doctor.doctorId}`} key={index}>
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    {/* Card Header */}
                    <div
                      className="relative h-28"
                      style={{ backgroundColor: "#48A6A7" }}
                    >
                      <div className="absolute -bottom-10 left-6">
                        <div
                          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold text-white"
                          style={{ backgroundColor: "#006A71" }}
                        >
                          {getInitials(doctor.userProfile?.profileName)}
                        </div>
                      </div>
                      <div
                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: doctor.available
                            ? "#9ACBD0"
                            : "#F2EFE7",
                          color: "#006A71",
                        }}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-12 pb-6 px-6">
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ color: "#006A71" }}
                      >
                        {doctor.userProfile?.profileName || "Doctor Name"}
                      </h3>

                      <div className="flex items-center mb-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium mr-2"
                          style={{
                            backgroundColor: "#F2EFE7",
                            color: "#48A6A7",
                          }}
                        >
                          {doctor.specialization?.specializationName ||
                            "General"}
                        </span>
                        <span className="text-sm" style={{ color: "#006A71" }}>
                          {doctor.qualification || "Medical Professional"}
                        </span>
                      </div>

                      <p
                        className="text-sm mb-6 line-clamp-2"
                        style={{ color: "#48A6A7" }}
                      >
                        {doctor.specialization?.specializationDescription ||
                          "Experienced healthcare professional dedicated to patient care and wellness."}
                      </p>

                      <div
                        className="flex items-center justify-between border-t pt-4"
                        style={{ borderColor: "#F2EFE7" }}
                      >
                        <div>
                          <span
                            className="block text-xs"
                            style={{ color: "#48A6A7" }}
                          >
                            Consultation Fee
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: "#006A71" }}
                          >
                            Rs{doctor.consultationFee || "N/A"}
                          </span>
                        </div>

                        <button
                          className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-md"
                          style={{ backgroundColor: "#006A71" }}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="bg-white rounded-lg shadow-md p-12 text-center"
              style={{ color: "#006A71" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#9ACBD0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4M8 16l-4-4 4-4M16 16l4-4-4-4"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">No Doctors found</h3>
              <p className="text-md" style={{ color: "#48A6A7" }}>
                We couldn't find any doctors matching your criteria. Please try
                adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
