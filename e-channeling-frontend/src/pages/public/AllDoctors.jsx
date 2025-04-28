import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/public/all-doctors"
      );
      const data = response.data;

      // Extract unique specializations for filter dropdown
      const uniqueSpecializations = [
        ...new Set(
          data.map((doctor) => doctor.specialization?.specializationName)
        ),
      ].filter(Boolean);

      setSpecializations(uniqueSpecializations);

      const imageResponse = await Promise.all(
        data.map(async (doctor) => {
          if (!doctor.userProfile?.profileImage) return doctor;

          try {
            const image = await axios.get(
              `http://localhost:8080/public/get-profile-image/${doctor.userProfile.profileId}`,
              { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(image.data);
            return {
              ...doctor,
              userProfile: {
                ...doctor.userProfile,
                profileImage: imageUrl,
              },
            };
          } catch (imageError) {
            console.error(
              "Failed to fetch image for doctor:",
              doctor.userProfile.profileId
            );
            return doctor;
          }
        })
      );

      setDoctors(imageResponse);
      setFilteredDoctors(imageResponse);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, specialization, doctors]);

  const filterDoctors = () => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.userProfile?.profileName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter(
        (doctor) => doctor.specialization?.specializationName === specialization
      );
    }

    setFilteredDoctors(filtered);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatTime = (time) => {
    if (!time) return "";
    // Converting 24-hour format to 12-hour with AM/PM
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSpecialization("");
    setFilteredDoctors(doctors);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#006A71] mb-8 text-center">
          Our Specialists
        </h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or qualification"
                className="w-full p-2 border border-[#9ACBD0] rounded-md focus:outline-none focus:ring focus:border-[#48A6A7]"
              />
            </div>

            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Specialization
              </label>
              <select
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 border border-[#9ACBD0] rounded-md focus:outline-none focus:ring focus:border-[#48A6A7]"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full p-2 bg-[#48A6A7] text-white rounded-md hover:bg-[#006A71] transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#48A6A7] text-xl">Loading doctors...</div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[#006A71]">
              No doctors match your search criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2 bg-[#48A6A7] text-white rounded-md hover:bg-[#006A71] transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#9ACBD0] hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-[#48A6A7] p-4 flex items-center justify-center">
                  {doctor.userProfile?.profileImage ? (
                    <img
                      src={doctor.userProfile.profileImage}
                      alt={doctor.userProfile?.profileName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#F2EFE7]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-[#9ACBD0] flex items-center justify-center border-4 border-[#F2EFE7]">
                      <span className="text-3xl font-bold text-white">
                        {doctor.userProfile?.profileName?.charAt(0) || "D"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#006A71] mb-2">
                    Dr. {doctor.userProfile?.profileName}
                  </h2>

                  <div className="flex items-center text-sm text-[#48A6A7] mb-4">
                    <span className="font-semibold">
                      {doctor.qualification}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{doctor.specialization?.specializationName}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 h-12 overflow-hidden">
                    {truncateText(
                      doctor.specialization?.specializationDescription,
                      75
                    )}
                  </p>

                  <div className="bg-[#F2EFE7] p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-[#006A71]">
                      Consultation Fee
                    </p>
                    <p className="text-lg font-bold text-[#006A71]">
                      Rs. {doctor.consultationFee.toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#006A71] mb-2">
                      Upcoming Schedules:
                    </p>
                    {doctor.schedules && doctor.schedules.length > 0 ? (
                      <ul className="space-y-2">
                        {doctor.schedules.slice(0, 1).map((schedule, idx) => (
                          <li
                            key={idx}
                            className="text-sm bg-[#9ACBD0] bg-opacity-20 p-2 rounded"
                          >
                            <span className="font-medium">
                              {formatDate(schedule.date)}
                            </span>
                            <div className="text-xs text-gray-600">
                              {formatTime(schedule.startTime)} -{" "}
                              {formatTime(schedule.endTime)}
                            </div>
                          </li>
                        ))}
                        {doctor.schedules.length > 2 && (
                          <li className="text-xs text-[#006A71] font-medium text-center italic">
                            +{doctor.schedules.length - 2} more schedule
                            {doctor.schedules.length - 2 > 1 ? "s" : ""}
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic bg-[#9ACBD0] bg-opacity-10 p-2 rounded text-center">
                        No upcoming schedules available <br />
                        Wait for the doctor to add schedules
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/doctor/${doctor.doctorId}`)}
                    className="w-full py-2 bottom-0 bg-[#006A71] text-white rounded-md hover:bg-[#48A6A7] transition-colors duration-300 font-medium mt-2"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;
