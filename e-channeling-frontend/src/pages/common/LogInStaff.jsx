import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogInStaff = () => {
  const [logInRequestDto, setLogInRequestDto] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLogInRequestDto({
      ...logInRequestDto,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(logInRequestDto);
      const response = await axios.post(
        "http://localhost:8080/auth/login-staff",
        logInRequestDto
      );

      console.log(response);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex justify-center items-center p-4">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-3xl font-bold text-[#006A71] mb-8">
          Staff LogIn Page
        </div>
        <div className="w-full flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 bg-[#9ACBD0] flex justify-center items-center p-6">
            <img
              src="https://media.istockphoto.com/id/1412630553/vector/smiling-female-doctor-with-crossed-arms-and-stethoscope-vector-flat-illustration.jpg?s=612x612&w=0&k=20&c=hTFRP0GvNI8Nqp94qpsnb4MD-VxuE9kwxAirSBX9xHc="
              alt="image"
              className="max-w-full max-h-full"
            />
          </div>
          <div className="w-full md:w-1/2 bg-white p-8">
            <form
              action="POST"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[#006A71] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className="p-3 rounded border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[#006A71] font-semibold"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="p-3 rounded border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#48A6A7] text-white py-3 px-4 rounded font-medium hover:bg-[#006A71] transition-colors mt-4"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInStaff;
