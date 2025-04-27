import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";

const DoctorQueue = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(-1);
  const [queuedPatients, setQueuedPatients] = useState([]);
  const navigate = useNavigate();

  const { doctorId } = useParams();
  const token = localStorage.getItem("token");

  // Fetch doctor's schedules
  useEffect(() => {
    axios
      .get(`http://localhost:8080/doctor/${doctorId}/schedules`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }) //http://localhost:8080/doctor/${doctorId}/schedules
      .then((res) => setSchedules(res.data))
      .catch((err) => console.error(err));
  }, [doctorId]);

  // WebSocket and data setup when schedule selected
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-doctor");
      }
    };
    checkAuth();

    if (!selectedSchedule) return;

    const stompClient = Stomp.over(
      () => new SockJS("http://localhost:8080/ws")
    );

    stompClient.connect({}, () => {
      // Subscribe to queue updates
      stompClient.subscribe(`/topic/queue-updates/${doctorId}`, (message) => {
        const payload = JSON.parse(message.body);
        setCurrentQueue(
          payload.currentQueueNumber !== -1
            ? payload.currentQueueNumber
            : currentQueue
        );
        fetchQueue();
      });
    });

    // Initial queue fetch
    const fetchQueue = () => {
      axios
        .get(`http://localhost:8080/doctor/queue?scheduleId=2&status=QUEUED`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }) //http://localhost:8080/doctor/queue?scheduleId=${scheduleId}&status=QUEUED
        .then((res) => {
          setQueuedPatients(res.data);
          console.log(res.data);
          // Set current queue only if not already set
          if (res.data.length > 0 && currentQueue === -1) {
            setCurrentQueue(res.data[0].queueNumber);
          }
          // Handle empty queue case
          if (res.data.length === 0) {
            setCurrentQueue(-1);
          }
        });
    };
    fetchQueue();

    return () => stompClient.disconnect();
  }, [selectedSchedule, doctorId]);

  const handleComplete = () => {
    axios
      .post(
        `http://localhost:8080/doctor/complete/${selectedSchedule}/${doctorId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ) //http://localhost:8080/doctor/complete/${scheduleId}/${doctorId}
      .catch((err) => console.error(err));
  };

  console.log(selectedSchedule + "selectedSchedule");

  return (
    <div
      className="pt-30 max-w-4xl mx-auto p-8 rounded-xl shadow-lg"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      <h2
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: "#006A71" }}
      >
        Doctor Queue
      </h2>

      <div className="relative mb-8">
        <select
          onChange={(e) => setSelectedSchedule(e.target.value)}
          className="w-full py-3 px-4 pr-10 rounded-lg border-2 appearance-none focus:outline-none focus:ring-2 transition-all text-lg cursor-pointer"
          style={{
            borderColor: "#48A6A7",
            color: "#006A71",
            backgroundColor: "white",
          }}
        >
          <option value="">Select Schedule</option>
          {schedules.map((schedule, index) => (
            <option key={index} value={schedule.scheduleId}>
              {schedule.date} - {schedule.startTime}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg
            className="w-5 h-5"
            style={{ fill: "#48A6A7" }}
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
          </svg>
        </div>
      </div>

      {selectedSchedule && (
        <div className="space-y-6">
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 rounded-lg shadow-md"
            style={{ backgroundColor: "#9ACBD0" }}
          >
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium" style={{ color: "#006A71" }}>
                Current Patient:
              </h3>
              <div
                className="mt-2 text-2xl font-bold"
                style={{ color: "#006A71" }}
              >
                {currentQueue !== -1 ? `#${currentQueue}` : "None"}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={currentQueue === -1}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all shadow-md hover:shadow-lg ${
                currentQueue === -1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-opacity-90"
              }`}
              style={{
                backgroundColor: currentQueue === -1 ? "#9ACBD0" : "#006A71",
              }}
            >
              Mark Completed
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4" style={{ backgroundColor: "#48A6A7" }}>
              <h4 className="text-xl font-bold text-white">Queued Patients</h4>
            </div>

            <div className="divide-y" style={{ divideColor: "#9ACBD0" }}>
              {queuedPatients.length > 0 ? (
                queuedPatients.map((quPatient, index) => (
                  <div
                    key={index}
                    className={`p-4 flex items-center ${
                      currentQueue === quPatient.queueNumber
                        ? "bg-opacity-10"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentQueue === quPatient.queueNumber
                          ? "#9ACBD0"
                          : "white",
                    }}
                  >
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-4"
                      style={{ backgroundColor: "#48A6A7" }}
                    >
                      {quPatient.queueNumber}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: "#006A71" }}>
                        {quPatient.appointment.patient.profileName}
                      </p>
                    </div>
                    {currentQueue === quPatient.queueNumber && (
                      <div
                        className="ml-auto px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: "#006A71" }}
                      >
                        Current
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="p-6 text-center" style={{ color: "#48A6A7" }}>
                  No patients in queue
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorQueue;
