import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  DollarSign,
  Award,
} from "lucide-react";

const MySchedules = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/doctor/get-schedules/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/doctor/appointmentsBy-schedules/${id}/${selectedSchedule}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setAppointment(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSchedule) {
      fetchAppointments();
    }
  }, [selectedSchedule]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-doctor");
      }
    };

    checkAuth();
    fetchSchedules();
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    try {
      // Handle time formats like "09:00:00"
      const [hours, minutes] = timeString.split(":");
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-6 pt-30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-[#006A71] rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">
            My Schedule & Appointments
          </h1>
          <p className="text-[#9ACBD0] mt-2">
            Manage your appointments and schedules efficiently
          </p>
        </div>

        {/* Schedule Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-[#48A6A7]">
          <h2 className="text-xl font-semibold text-[#006A71] mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Select Schedule
          </h2>

          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse bg-[#9ACBD0] h-10 w-10 rounded-full"></div>
            </div>
          ) : (
            <select
              onChange={(e) => {
                setSelectedSchedule(e.target.value);
                setAppointment([]);
              }}
              value={selectedSchedule || ""}
              className="w-full py-3 px-4 rounded-lg border-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#48A6A7] transition-all text-lg cursor-pointer"
              style={{
                borderColor: "#9ACBD0",
                color: "#006A71",
              }}
            >
              <option value="">Select a Schedule</option>
              {schedules.map((schedule, index) => (
                <option key={index} value={schedule.scheduleId}>
                  {formatDate(schedule.date)} • {formatTime(schedule.startTime)}{" "}
                  - {formatTime(schedule.endTime)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Appointments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#006A71] mb-4 flex items-center">
            <UserCheck className="mr-2" size={20} />
            Appointments
          </h2>

          {loading && selectedSchedule ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse bg-[#48A6A7] h-12 w-12 rounded-full"></div>
            </div>
          ) : selectedSchedule && appointment.length > 0 ? (
            <div className="space-y-4">
              {appointment.map((app, index) => (
                <div
                  key={app.appointmentId}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left side with patient number */}
                    <div className="bg-[#48A6A7] p-4 flex items-center justify-center md:w-24">
                      <div className="text-white text-center">
                        <span className="block text-sm">Queue</span>
                        <span className="block text-3xl font-bold">
                          {app.queue?.queueNumber || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-[#006A71] mb-2">
                            {app.patient.profileName}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <p className="flex items-center text-gray-600">
                              <User size={16} className="mr-2 text-[#48A6A7]" />
                              {app.patient.profileEmail}
                            </p>
                            <p className="flex items-center text-gray-600">
                              <Clock
                                size={16}
                                className="mr-2 text-[#48A6A7]"
                              />
                              {app.patient.phone}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:text-right">
                          <div className="mb-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                app.appointmentStatus === "BOOKED"
                                  ? "bg-[#9ACBD0] text-[#006A71]"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {app.appointmentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Award size={16} className="mr-2 text-[#48A6A7]" />
                          <span className="text-sm font-medium text-gray-700">
                            Dr. {app.doctor.doctorName} •{" "}
                            {app.doctor.specialization}
                          </span>
                        </div>
                        <div className="flex items-center mt-2">
                          <Calendar size={16} className="mr-2 text-[#48A6A7]" />
                          <span className="text-sm text-gray-600">
                            {formatDate(app.schedule.date)} •{" "}
                            {formatTime(app.schedule.startTime)} -{" "}
                            {formatTime(app.schedule.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-10 text-center border border-dashed border-[#9ACBD0]">
              <div className="text-[#48A6A7] mb-3">
                <Calendar size={40} className="mx-auto opacity-70" />
              </div>
              <p className="text-gray-600 text-lg">
                {selectedSchedule
                  ? "No appointments for this schedule"
                  : "Please select a schedule to view appointments"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySchedules;
