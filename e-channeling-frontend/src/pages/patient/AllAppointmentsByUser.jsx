import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AllAppointmentsByUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }

      window.addEventListener("storage", checkAuth);
    };

    checkAuth();
    fetchAppointments();
  }, []);

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

  const handleReadMore = (appointmentId) => {
    // Navigate to appointment details page
    navigate(`/appointments/${appointmentId}`);
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#006A71] mb-6">
          My Appointments
        </h1>

        <div className="grid gap-4">
          {appointments &&
            appointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="bg-white rounded-lg shadow p-4 border-l-4 border-[#48A6A7] hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#9ACBD0] text-[#006A71] font-medium px-3 py-1 rounded-full text-sm">
                      #{appointment.appointmentId}
                    </span>
                    <span className="bg-[#F2EFE7] text-[#006A71] font-medium px-3 py-1 rounded-full text-sm">
                      {appointment.appointmentStatus}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Queue:{" "}
                    <span className="font-medium">
                      {appointment.queue.queueNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="font-medium text-lg text-[#006A71]">
                    Dr. {appointment.doctor.doctorName}
                  </div>
                  <div className="text-sm text-[#48A6A7]">
                    {appointment.doctor.specialization}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  {appointment.schedule.date}
                </div>

                <div className="flex justify-end space-x-4 ">
                  <div className="mt-4 flex justify-end ">
                    <button
                      onClick={() => handleReadMore(appointment.appointmentId)}
                      className="bg-[#48A6A7] hover:bg-[#006A71] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Read More
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllAppointmentsByUser;
