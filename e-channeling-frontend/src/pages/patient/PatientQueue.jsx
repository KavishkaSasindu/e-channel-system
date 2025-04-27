import { useEffect, useState } from "react";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate, useParams } from "react-router-dom";

const PatientQueue = () => {
  const [currentQueue, setCurrentQueue] = useState(null);
  const [yourQueue, setYourQueue] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [isBlinking, setIsBlinking] = useState(true);
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  // Fetch initial queue data
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);

    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8080/patient/appointment/${appointmentId}/queue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setYourQueue(res.data.queueNumber);
        setDoctorId(res.data.doctorId);
        setCurrentQueue(res.data.currentQueue || -1);
      })
      .catch((error) => {
        console.error("Error fetching queue data:", error);
      });

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [appointmentId, navigate]);

  // WebSocket setup
  useEffect(() => {
    if (!doctorId) return;

    const stompClient = Stomp.over(
      () => new SockJS("http://localhost:8080/ws")
    );

    const connectCallback = () => {
      stompClient.subscribe(`/topic/queue-updates/${doctorId}`, (message) => {
        const payload = JSON.parse(message.body);
        setCurrentQueue(payload.currentQueueNumber);
      });
    };

    const errorCallback = (error) => {
      console.error("STOMP connection error:", error);
      // Implement reconnection logic if needed
    };

    stompClient.connect({}, connectCallback, errorCallback);

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [doctorId]);

  // Blinking effect for current queue
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Get status message
  const getStatusMessage = () => {
    if (currentQueue === null) return "Loading queue status...";
    if (currentQueue === -1) return "Not started yet";
    if (yourQueue === currentQueue) return "It's your turn!";
    if (yourQueue > currentQueue)
      return `Patients ahead: ${yourQueue - currentQueue}`;
    return "Your consultation is completed";
  };

  // Generate queue squares
  const renderQueueSquares = () => {
    if (yourQueue === null || currentQueue === null) return null;

    const startQueue = Math.max(1, currentQueue - 3);
    const endQueue = Math.max(yourQueue + 3, currentQueue + 5);
    const squares = [];

    for (let i = startQueue; i <= endQueue; i++) {
      const isCurrentQueue = i === currentQueue;
      const isYourQueue = i === yourQueue;

      squares.push(
        <div
          key={i}
          className={`
            w-12 h-12 m-2 flex items-center justify-center rounded
            ${isYourQueue ? "border-4 border-yellow-500" : ""}
            ${
              isCurrentQueue && currentQueue !== -1
                ? isBlinking
                  ? "bg-teal-600"
                  : "bg-teal-500"
                : ""
            }
            ${!isCurrentQueue && i < currentQueue ? "bg-gray-300" : ""}
            ${!isCurrentQueue && i > currentQueue ? "bg-teal-200" : ""}
            ${currentQueue === -1 ? "bg-teal-200" : ""}
          `}
        >
          {i}
        </div>
      );
    }

    return <div className="flex flex-wrap justify-center my-6">{squares}</div>;
  };

  return (
    <div
      className="pt-20 max-w-lg mx-auto p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "#F2EFE7" }}
    >
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "#006A71" }}
      >
        Queue Status
      </h2>

      <div className="mb-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl"
            style={{ backgroundColor: "#9ACBD0", color: "#006A71" }}
          >
            {yourQueue ?? "..."}
          </div>
        </div>
        <p className="font-medium text-teal-700">Your Queue Number</p>
      </div>

      <div className="mb-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl ${
              currentQueue !== -1 && isBlinking ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: currentQueue === -1 ? "#F2EFE7" : "#48A6A7",
              color: currentQueue === -1 ? "#006A71" : "#F2EFE7",
              border: currentQueue === -1 ? "2px dashed #48A6A7" : "none",
            }}
          >
            {currentQueue === -1 ? "-" : currentQueue}
          </div>
        </div>
        <p className="font-medium" style={{ color: "#006A71" }}>
          Currently Serving
        </p>
      </div>

      <div
        className="p-4 rounded-lg mb-6 text-center font-bold text-lg"
        style={{ backgroundColor: "#9ACBD0", color: "#006A71" }}
      >
        {getStatusMessage()}
      </div>

      {renderQueueSquares()}

      <div className="mt-8 bg-white p-4 rounded-lg border border-teal-200">
        <h3 className="font-bold mb-2" style={{ color: "#006A71" }}>
          How It Works
        </h3>
        <ul className="text-md space-y-2 text-teal-800">
          <li>
            • Queue squares show position:{" "}
            <span className="bg-gray-300 px-2 py-1 rounded">completed</span>,{" "}
            <span className="bg-teal-600 px-2 py-1 rounded text-white">
              current
            </span>
            , <span className="bg-teal-200 px-2 py-1 rounded">waiting</span>
          </li>
          <li>• Your number is highlighted with a yellow border</li>
          <li>• The current number blinks when active</li>
          <li>
            • When the doctor marks a consultation complete, the next number
            becomes current
          </li>
          <li>• Real-time updates happen automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientQueue;
