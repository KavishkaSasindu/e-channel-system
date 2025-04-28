import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AllAppointmentsByUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setState] = useState(true);
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
  }, [navigate, id]);

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
      setState(false);
      console.log(data);
    } catch (error) {
      console.log(error);
      setState(false);
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

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-lg text-gray-600">Loading appointments...</div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-xl font-medium text-[#006A71] mb-3">
              No Appointments Found
            </div>
            <p className="text-gray-600 mb-6">
              You don't have any appointments scheduled at the moment.
            </p>
            <button
              onClick={() => navigate("/all-doctors")}
              className="bg-[#48A6A7] hover:bg-[#006A71] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Book New Appointment
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
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
                  <div className="mt-4 flex justify-end "></div>
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
        )}
      </div>
    </div>
  );
};

export default AllAppointmentsByUser;
