import React, { useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../common/AuthProvider";
import { AdminNav, GuestNav, PatientNav, StaffNav } from "./nav/BaseNavbar";
import { useState } from "react";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const role = user?.role || "guest";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div>
        {token && role === "PATIENT" && <PatientNav />}
        {token && role === "STAFF" && <StaffNav />}
        {token && role === "DOCTOR" && <AdminNav />}
        {!token && <GuestNav />}
      </div>
    </div>
  );
};

export default Navbar;
