import axios from "axios";
import React from "react";
import { useState } from "react";

const Register = () => {
  const [userProfile, setProfile] = useState({
    profileName: "",
    profileEmail: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setProfile({
      ...userProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register-patient",
        userProfile
      );

      console.log(response);
      if (response.status === 201) {
        alert("Registration successful!");
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE7] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mt-20">
        <div className="md:w-1/2 bg-[#48A6A7] p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Join Our Healthcare Community
          </h1>
          <p className="text-[#F2EFE7] mb-8">
            Create your patient account to access personalized healthcare
            services and manage your appointments online.
          </p>
          <div className="flex justify-center">
            <img
              src="https://img.freepik.com/premium-vector/doctors-male-female-isolated-vector-flat-style-cartoon-illustration_357257-1441.jpg"
              alt="image"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#006A71]">Register</h2>
            <p className="text-gray-600 mt-2">
              Please fill in your information below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" action="POST">
            <div>
              <label
                htmlFor="profileName"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Profile Name
              </label>
              <input
                type="text"
                name="profileName"
                placeholder="John Doe"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="profileEmail"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                name="profileEmail"
                placeholder="john@example.com"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="*************"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="077-789-8977"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[#006A71] mb-1"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="89 Medical Street, Healthville, State"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] focus:border-transparent"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#006A71] hover:bg-[#48A6A7] text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
              >
                Create Account
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <a
                href="#"
                className="text-[#006A71] font-medium hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
