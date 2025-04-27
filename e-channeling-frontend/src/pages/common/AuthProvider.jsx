import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decode = jwtDecode(token);
        console.log(decode.role);
        if (decode.role === "PATIENT") {
          setUser({
            role: decode.role,
            profileId: decode.profileId,
            email: decode.email,
            username: decode.username,
          });
        } else if (decode.role === "STAFF") {
          setUser({
            role: decode.role,
            profileId: decode.profileId,
            staffId: decode.staffId,
            email: decode.email,
            username: decode.username,
          });
        } else {
          setUser({
            role: decode.role,
            profileId: decode.profileId,
            doctorId: decode.doctorId,
            email: decode.email,
            username: decode.username,
          });
        }
      } else {
        setUser(null);
      }
    };

    updateUser();

    // listen for event changes
    window.addEventListener("storage", updateUser);

    // cleanup changes
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
