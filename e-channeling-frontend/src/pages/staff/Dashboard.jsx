import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/public/all-doctors"
      );

      const data = response.data;

      const doctorsWithImage = await Promise.all(
        data.map(async (doctor) => {
          const image = await axios.get(
            `http://localhost:8080/public/get-profile-image/${doctor.userProfile?.profileId}`,
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
        })
      );

      setDoctors(data);
      setFilteredDoctors(doctorsWithImage);
      console.log(data);
      console.log(doctorsWithImage);
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

  const deleteDoctor = async (doctorId) => {
    try {
      toast.success(
        "Deleting a doctor may take some time.\nWe are notifying all users who use our service.\nPlease wait it will reload the page after delete",
        {
          position: "bottom-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      const response = await axios.delete(
        `http://localhost:8080/staff/delete/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(
          "Deleted successfully and informed all users who use our service.",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
        setTimeout(() => {
          location.reload();
          fetchAllDoctors();
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.userProfile?.profileName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.specialization?.specializationName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

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
          </div>

          {/* Doctors Table Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#006A71" }}
              >
                Doctors Table
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: "#9ACBD0",
                    color: "#006A71",
                    width: "250px",
                  }}
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "#48A6A7" }}
                />
              </div>
            </div>

            <div
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: "#9ACBD0" }}
            >
              <div className="overflow-x-auto">
                <div style={{ height: "400px", overflowY: "auto" }}>
                  <table
                    className="min-w-full divide-y"
                    style={{ borderColor: "#9ACBD0" }}
                  >
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#9ACBD0",
                      }}
                    >
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Specialization
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Qualification
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Fee
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                          style={{ color: "#006A71" }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: "#006A71",
                                    color: "white",
                                  }}
                                >
                                  {getInitials(doctor.userProfile?.profileName)}
                                </div>
                                <div className="ml-4">
                                  <div
                                    className="text-sm font-medium"
                                    style={{ color: "#006A71" }}
                                  >
                                    {doctor.userProfile?.profileName ||
                                      "Doctor Name"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className="text-sm"
                                style={{ color: "#48A6A7" }}
                              >
                                {doctor.specialization?.specializationName ||
                                  "Specialization"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className="text-sm"
                                style={{ color: "#006A71" }}
                              >
                                {doctor.qualification || "Qualification"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className="text-sm font-medium"
                                style={{ color: "#006A71" }}
                              >
                                Rs:{doctor.consultationFee || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full"
                                style={{
                                  backgroundColor: doctor.available
                                    ? "#9ACBD0"
                                    : "#F2EFE7",
                                  color: "#006A71",
                                }}
                              >
                                {doctor.available ? "Available" : "Unavailable"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button
                                className="text-white px-3 py-1 rounded mr-2"
                                style={{ backgroundColor: "#48A6A7" }}
                                onClick={() =>
                                  navigate(`/doctor/${doctor.doctorId}`)
                                }
                              >
                                View
                              </button>
                              <button
                                className="text-white px-3 py-1 rounded"
                                style={{ backgroundColor: "#006A71" }}
                                onClick={() =>
                                  navigate(
                                    `/staff/update-doctor/${doctor.doctorId}/${doctor.userProfile?.profileId}`
                                  )
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="text-white px-3 py-1 rounded"
                                style={{ backgroundColor: "#A74848" }}
                                onClick={() => deleteDoctor(doctor.doctorId)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center"
                            style={{ color: "#006A71" }}
                          >
                            No doctors found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
