import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  PlusCircle,
  Bell,
  Search,
  User,
  LogOut,
  Clipboard,
  Calendar,
  FileText,
} from "lucide-react";
import { AuthContext } from "../../common/AuthProvider";

const logOut = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage"));
};

// Base Navbar layout component that will be used by all role-specific navbars
const BaseNavbar = ({ children, navLinks, rightSideContent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-[100%]">
      <nav
        className={`fixed flex justify-center items-center w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 bg-[#006A71] shadow-lg"
            : "py-4 bg-[#006A71] bg-opacity-90"
        }`}
      >
        <div className="container mx-auto px-4 w-[95%]">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={"/"}>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-[#9ACBD0] rounded-lg flex items-center justify-center">
                  <PlusCircle size={18} className="text-[#006A71]" />
                </div>
                <div className="text-xl font-bold text-white">MediQ</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Navigation Links */}
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white hover:text-[#9ACBD0] transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9ACBD0] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}

              {/* Additional content specific to role */}
              {children}

              {/* Search Bar - show for all users */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#48A6A7] bg-opacity-50 text-white placeholder-[#9ACBD0] rounded-full py-1 px-4 pl-9 focus:outline-none focus:ring-2 focus:ring-[#9ACBD0] w-36 focus:w-48 transition-all duration-300"
                />
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ACBD0]"
                />
              </div>
            </div>

            {/* Right Side Nav Items - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {rightSideContent}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-[#006A71] py-4 mt-4 rounded-lg shadow-lg">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-white hover:text-[#9ACBD0] px-4 py-2 hover:bg-[#48A6A7] hover:bg-opacity-30 rounded-lg transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile version of the additional content */}
                <div className="px-4">
                  {React.cloneElement(children, { isMobile: true })}
                </div>

                <div className="relative px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-[#48A6A7] bg-opacity-50 text-white placeholder-[#9ACBD0] rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#9ACBD0] w-full"
                  />
                  <Search
                    size={18}
                    className="absolute left-7 top-1/2 transform -translate-y-1/2 text-[#9ACBD0]"
                  />
                </div>

                <div className="pt-3 flex flex-col space-y-3 px-4">
                  {/* Mobile version of right side content */}
                  {React.cloneElement(rightSideContent, { isMobile: true })}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

// 1. Guest Navbar (Not logged in)
const GuestNav = () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/all-doctors" },
    { name: "About Us", href: "/about" },
  ];

  // Create the component directly as a function that takes props
  const GuestRightContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <>
          <Link to={"/login"} className="w-full">
            <button className="bg-[#48A6A7] text-white py-2 px-4 rounded-full hover:bg-[#9ACBD0] transition-colors w-full">
              Sign In
            </button>
          </Link>
          <Link to="/register" className="w-full">
            <button className="bg-white text-[#006A71] py-2 px-4 rounded-full hover:bg-[#F2EFE7] transition-colors flex items-center justify-center w-full">
              <User size={16} className="mr-2" /> Register
            </button>
          </Link>
        </>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <Link to={"/login"}>
          <button className="bg-[#48A6A7] text-white py-2 px-5 rounded-full hover:bg-[#9ACBD0] transition-colors transform hover:scale-105 duration-200">
            Sign In
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-white text-[#006A71] py-2 px-5 rounded-full hover:bg-[#F2EFE7] transition-colors transform hover:scale-105 duration-200 flex items-center">
            <User size={16} className="mr-2" /> Register
          </button>
        </Link>
      </div>
    );
  };

  // No additional content for guests
  const GuestContent = ({ isMobile }) => null;

  return (
    <BaseNavbar
      navLinks={navLinks}
      rightSideContent={<GuestRightContent isMobile={false} />}
    >
      <GuestContent isMobile={false} />
    </BaseNavbar>
  );
};

// 2. Patient Navbar
const PatientNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const profileId = user?.profileId || null;

  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/all-doctors" },
    { name: "About Us", href: "/about" },
  ];

  const PatientRightContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <button className="bg-white text-[#006A71] py-2 px-4 rounded-full hover:bg-[#F2EFE7] transition-colors flex items-center justify-center w-full">
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(`/patient/profile/${profileId}`)}
          className="text-white rounded-full p-2 hover:bg-[#48A6A7] transition-colors relative"
        >
          Profile
        </button>
        <button
          onClick={logOut}
          className="bg-white text-[#006A71] py-2 px-5 rounded-full hover:bg-[#F2EFE7] transition-colors transform hover:scale-105 duration-200 flex items-center"
        >
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </div>
    );
  };

  const PatientContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <div className="py-2">
          <button
            className="text-white hover:text-[#9ACBD0] flex items-center justify-between w-full"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>Features</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="mt-2 pl-4 space-y-2 border-l-2 border-[#48A6A7]">
              <Link
                to={`/patient/appointments/${profileId}`}
                className="block py-1 text-[#9ACBD0] hover:text-white transition-colors"
              >
                My Appointments
              </Link>
              <Link
                to={`/patient/order/${profileId}`}
                href="/pharmacy"
                className="block py-1 text-[#9ACBD0] hover:text-white transition-colors"
              >
                Online Pharmacy
              </Link>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          className="text-white hover:text-[#9ACBD0] transition-colors flex items-center py-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Features{" "}
          <ChevronDown
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <Link
              to={`/patient/appointments/${profileId}`}
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              My Appointments
            </Link>
            <Link
              to={`/patient/order/${profileId}`}
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              Online Pharmacy
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseNavbar
      navLinks={navLinks}
      rightSideContent={<PatientRightContent isMobile={false} />}
    >
      <PatientContent isMobile={false} />
    </BaseNavbar>
  );
};

// 3. Staff Navbar
const StaffNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStaffMenuOpen, setIsStaffMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const profileId = user?.profileId || null;
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/all-doctors" },
    { name: "About Us", href: "/about" },
    { name: "Dashboard", href: "/staff/dashboard" },
    { name: "Orders", href: "/orders" },
  ];

  const StaffRightContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <button className="bg-white text-[#006A71] py-2 px-4 rounded-full hover:bg-[#F2EFE7] transition-colors flex items-center justify-center w-full">
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(`/patient/profile/${profileId}`)}
          className=" text-white py-2 px-5 rounded-full hover:bg-[#F2EFE7] hover:text-[#006A71] transition-colors transform hover:scale-105 duration-200 flex items-center"
        >
          Profile
        </button>
        <button
          onClick={logOut}
          className="bg-white text-[#006A71] py-2 px-5 rounded-full hover:bg-[#F2EFE7] transition-colors transform hover:scale-105 duration-200 flex items-center"
        >
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </div>
    );
  };

  const StaffContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <>
          <div className="py-2">
            <button
              className="text-white hover:text-[#9ACBD0] flex items-center justify-between w-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Features</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="mt-2 pl-4 space-y-2 border-l-2 border-[#48A6A7]">
                <Link
                  to={`/patient/appointments/${profileId}`}
                  href="/appointments"
                  className="block py-1 text-[#9ACBD0] hover:text-white transition-colors"
                >
                  My Appointments
                </Link>
                <Link
                  to={"/orders"}
                  className="block py-1 text-[#9ACBD0] hover:text-white transition-colors"
                >
                  Online Pharmacy
                </Link>
              </div>
            )}
          </div>

          <div className="py-2">
            <button
              onClick={() => navigate(`/patient/profile/${profileId}`)}
              className="text-white hover:text-[#9ACBD0] flex items-center justify-between w-full"
            >
              <span>Profile</span>
            </button>
          </div>
        </>
      );
    }

    return (
      <div className="relative">
        <button
          className="text-white hover:text-[#9ACBD0] transition-colors flex items-center py-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Features{" "}
          <ChevronDown
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <Link
              to={`/patient/appointments/${profileId}`}
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              My Appointments
            </Link>
            <Link
              to={`/patient/order/${profileId}`}
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              Online Pharmacy
            </Link>
            <Link
              to={"/orders"}
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              Orders
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseNavbar
      navLinks={navLinks}
      rightSideContent={<StaffRightContent isMobile={false} />}
    >
      <StaffContent isMobile={false} />
    </BaseNavbar>
  );
};

// 4. Admin Navbar
const AdminNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const doctorId = user?.doctorId;
  console.log(doctorId);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Doctors", href: "/all-doctors" },
    { name: "About", href: "/about" },
  ];

  const AdminRightContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <button
          onClick={logOut}
          className="bg-white text-[#006A71] py-2 px-4 rounded-full hover:bg-[#F2EFE7] transition-colors flex items-center justify-center w-full"
        >
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <div className="relative"></div>
        <button
          onClick={logOut}
          className="bg-white text-[#006A71] py-2 px-5 rounded-full hover:bg-[#F2EFE7] transition-colors transform hover:scale-105 duration-200 flex items-center"
        >
          <LogOut size={16} className="mr-2" /> Logout
        </button>
      </div>
    );
  };

  const AdminContent = ({ isMobile }) => {
    if (isMobile) {
      return (
        <>
          <div className="py-2">
            <button
              className="text-white hover:text-[#9ACBD0] flex items-center justify-between w-full"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Queue</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="mt-2 pl-4 space-y-2 border-l-2 border-[#48A6A7]">
                <Link
                  to={`/doctor/schedules/${doctorId}`}
                  href="/statistics"
                  className="block py-1 text-[#9ACBD0] hover:text-white transition-colors"
                >
                  My Schedules
                </Link>
                <Link
                  to={`/doctor/queue/${doctorId}`}
                  href="/monitoring"
                  className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
                >
                  Queue Monitoring
                </Link>
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <div className="relative">
        <button
          className="text-white hover:text-[#9ACBD0] transition-colors flex items-center py-2"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Queue{" "}
          <ChevronDown
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <Link
              to={`/doctor/schedules/${doctorId}`}
              href="/statistics"
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              My Schedules
            </Link>
            <Link
              to={`/doctor/queue/${doctorId}`}
              href="/monitoring"
              className="block px-4 py-2 text-[#006A71] hover:bg-[#F2EFE7] transition-colors"
            >
              Queue Monitoring
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseNavbar
      navLinks={navLinks}
      rightSideContent={<AdminRightContent isMobile={false} />}
    >
      <AdminContent isMobile={false} />
    </BaseNavbar>
  );
};

// Export all navbar components
export { GuestNav, PatientNav, StaffNav, AdminNav };
