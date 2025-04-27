import { useState, useEffect } from "react";
import {
  Clock,
  User,
  ShoppingBag,
  Upload,
  ChevronRight,
  ChevronDown,
  X,
  Menu,
  Search,
  Calendar,
  ArrowRight,
  PlusCircle,
  Heart,
  Phone,
  Shield,
} from "lucide-react";

export default function EChannelingHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentQueue, setCurrentQueue] = useState(24);

  return (
    <div className="">
      <div className="min-h-screen w-full mx-auto  bg-[#F2EFE7] text-gray-800  overflow-x-hidden">
        {/* Hero Section */}
        <section className="pt-32 pb-16  flex justify-center items-center">
          <div className="container mx-auto px-4 w-[95%]">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#006A71] mb-6 leading-tight">
                  Modern Healthcare <br className="hidden md:block" />
                  <span className="text-[#48A6A7]">Simplified</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-lg">
                  Experience hassle-free appointments with real-time updates and
                  doorstep medication delivery.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-[#006A71] text-white py-3 px-6 rounded-full font-medium hover:bg-[#48A6A7] transition-colors transform hover:scale-105 duration-200 flex items-center">
                    Book Now <ArrowRight size={16} className="ml-2" />
                  </button>
                  <button className="bg-transparent border-2 border-[#006A71] text-[#006A71] py-3 px-6 rounded-full font-medium hover:bg-[#006A71] hover:text-white transition-colors">
                    Learn More
                  </button>
                </div>

                <div className="mt-10 flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-[#9ACBD0] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#48A6A7] border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-[#006A71] border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <span className="text-sm text-gray-600">Trusted by</span>
                    <p className="font-medium">2,000+ patients</p>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                {/* Replaced live queue with feature highlight cards */}
                <div className="relative flex justify-center items-center">
                  <img
                    className="w-[500px] h-[500px] hover:scale-105 transition-transform duration-300 rounded-full shadow-lg"
                    src="https://img.freepik.com/premium-vector/doctor-vector-illustration_38694-150.jpg"
                    alt="doctor-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Image Section - Improved with actual image placeholders */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 w-[95%]">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#006A71] mb-3">
                Our Healthcare Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive healthcare solutions designed to meet your needs
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Card 1 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg h-64 transform transition-transform hover:scale-105 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#006A71] opacity-70"></div>
                  {/* Placeholder for image */}
                  <div className="h-full bg-[#48A6A7] bg-opacity-20 flex flex-col justify-center items-center">
                    <div className="mb-4 text-white">
                      <Heart size={40} strokeWidth={1.5} />
                    </div>
                    <div className="px-6 py-4 z-10 absolute bottom-0 left-0 right-0">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Doctor Consultations
                      </h3>
                      <p className="text-[#9ACBD0] text-sm hidden group-hover:block transition-all duration-300">
                        Connect with doctors with your fingertips
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Card 2 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg h-64 md:h-80 transform transition-transform hover:scale-105 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#006A71] opacity-70"></div>
                  {/* Placeholder for image */}
                  <div className="h-full bg-[#006A71] bg-opacity-20 flex flex-col justify-center items-center">
                    <div className="mb-4 text-white">
                      <ShoppingBag size={40} strokeWidth={1.5} />
                    </div>
                    <div className="px-6 py-4 z-10 absolute bottom-0 left-0 right-0">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Online Pharmacy
                      </h3>
                      <p className="text-[#9ACBD0] text-sm hidden group-hover:block transition-all duration-300">
                        Upload prescriptions and get medications delivered to
                        your doorstep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Card 3 */}
                <div className="group relative overflow-hidden rounded-2xl shadow-lg h-64 transform transition-transform hover:scale-105 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#006A71] opacity-70"></div>
                  {/* Placeholder for image */}
                  <div className="h-full bg-[#48A6A7] bg-opacity-20 flex flex-col justify-center items-center">
                    <div className="mb-4 text-white">
                      <Shield size={40} strokeWidth={1.5} />
                    </div>
                    <div className="px-6 py-4 z-10 absolute bottom-0 left-0 right-0">
                      <h3 className="text-xl font-bold text-white mb-2">
                        pay as you go
                      </h3>
                      <p className="text-[#9ACBD0] text-sm hidden group-hover:block transition-all duration-300">
                        Pay when you are visit the doctor
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Accent Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#9ACBD0] opacity-10 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#48A6A7] opacity-10 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Features Tabs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#006A71] mb-4">
                Our Unique Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover how our platform transforms your healthcare experience
                with these innovative features
              </p>
            </div>

            {/* Interactive Tabs */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center mb-8">
                <button
                  className={`px-6 py-3 rounded-full mx-2 mb-3 transition-all duration-300 ${
                    activeTab === "appointments"
                      ? "bg-[#006A71] text-white"
                      : "bg-white text-[#006A71] hover:bg-[#9ACBD0] hover:text-white"
                  }`}
                  onClick={() => setActiveTab("appointments")}
                >
                  Real-time Queue
                </button>
                <button
                  className={`px-6 py-3 rounded-full mx-2 mb-3 transition-all duration-300 ${
                    activeTab === "pharmacy"
                      ? "bg-[#006A71] text-white"
                      : "bg-white text-[#006A71] hover:bg-[#9ACBD0] hover:text-white"
                  }`}
                  onClick={() => setActiveTab("pharmacy")}
                >
                  Online Pharmacy
                </button>
                <button
                  className={`px-6 py-3 rounded-full mx-2 mb-3 transition-all duration-300 ${
                    activeTab === "doctors"
                      ? "bg-[#006A71] text-white"
                      : "bg-white text-[#006A71] hover:bg-[#9ACBD0] hover:text-white"
                  }`}
                  onClick={() => setActiveTab("doctors")}
                >
                  Doctor Consultations
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500">
                {activeTab === "appointments" && (
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                      <h3 className="text-2xl font-bold text-[#006A71] mb-4">
                        Real-time Queue Updates
                      </h3>
                      <p className="text-gray-700 mb-4">
                        No more wasting time in waiting rooms. Our smart queue
                        system shows you exactly when it's your turn.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Live updates on current and next patient numbers
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Push notifications when you're next in line
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>Accurate waiting time estimations</span>
                        </li>
                      </ul>
                      <button className="mt-6 bg-[#006A71] text-white py-2 px-5 rounded-lg hover:bg-[#48A6A7] transition-colors inline-flex items-center">
                        Learn More <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                    <div className="md:w-1/2 bg-[#F2EFE7] p-6 rounded-xl">
                      <div className="relative">
                        <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
                          <div>
                            <p className="text-sm text-gray-500">
                              Current Patient
                            </p>
                            <p className="text-xl font-bold text-[#006A71]">
                              A-{currentQueue}
                            </p>
                          </div>
                          <div className="h-10 w-10 bg-[#48A6A7] rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg shadow-sm mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Your Number</p>
                            <p className="font-bold text-[#006A71]">
                              A-{currentQueue + 4}
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-[#48A6A7] h-2 rounded-full w-1/3"></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Estimated wait: 25 minutes
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-gray-500">Next Up</p>
                            <p className="font-medium">A-{currentQueue + 1}</p>
                          </div>
                          <div className="flex-1 p-3 bg-white rounded-lg shadow-sm text-center">
                            <p className="text-sm text-gray-500">In Queue</p>
                            <p className="font-medium">8 patients</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "pharmacy" && (
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                      <h3 className="text-2xl font-bold text-[#006A71] mb-4">
                        Online Pharmacy
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Skip the lines and get medications delivered to your
                        doorstep with our secure prescription service.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Upload prescriptions securely from your phone
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Home delivery with temperature-controlled packaging
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Medication reminders and auto-refill option
                          </span>
                        </li>
                      </ul>
                      <button className="mt-6 bg-[#006A71] text-white py-2 px-5 rounded-lg hover:bg-[#48A6A7] transition-colors inline-flex items-center">
                        Order Now <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                    <div className="md:w-1/2 bg-[#F2EFE7] p-6 rounded-xl">
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                        <div className="flex items-center mb-3">
                          <Upload size={20} className="text-[#48A6A7] mr-2" />
                          <h4 className="font-medium">Upload Prescription</h4>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <p className="text-gray-500 text-sm">
                            Drag & drop your prescription here or
                          </p>
                          <button className="mt-2 text-[#48A6A7] font-medium">
                            Browse Files
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-3">Delivery Options</h4>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-[#9ACBD0] hover:bg-opacity-10">
                          <div>
                            <p className="font-medium">Express Delivery</p>
                            <p className="text-sm text-gray-500">4-6 hours</p>
                          </div>
                          <p className="font-medium text-[#006A71]">$5.99</p>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-[#9ACBD0] hover:bg-opacity-10">
                          <div>
                            <p className="font-medium">Standard Delivery</p>
                            <p className="text-sm text-gray-500">Next day</p>
                          </div>
                          <p className="font-medium text-[#006A71]">Free</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "doctors" && (
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                      <h3 className="text-2xl font-bold text-[#006A71] mb-4">
                        Doctor Consultations
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Choose from our network of qualified healthcare
                        professionals for in-person or virtual consultations.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Filter doctors by specialty, rating, and
                            availability
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Video consultations with secure end-to-end
                            encryption
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-[#48A6A7] flex items-center justify-center text-white mr-3 mt-1">
                            ✓
                          </div>
                          <span>
                            Digital health records accessible to your doctor
                          </span>
                        </li>
                      </ul>
                      <button className="mt-6 bg-[#006A71] text-white py-2 px-5 rounded-lg hover:bg-[#48A6A7] transition-colors inline-flex items-center">
                        Find Doctors <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                    <div className="md:w-1/2 bg-[#F2EFE7] p-6 rounded-xl">
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                        <h4 className="font-medium mb-3">Top Specialists</h4>

                        <div className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-[#9ACBD0] hover:bg-opacity-10">
                          <div className="w-10 h-10 rounded-full bg-[#48A6A7] mr-3"></div>
                          <div className="flex-1">
                            <p className="font-medium">Dr. Sarah Johnson</p>
                            <p className="text-sm text-gray-500">
                              Cardiologist
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-1">
                              ★★★★★
                            </div>
                            <p className="text-xs text-gray-500">
                              Available Today
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-[#9ACBD0] hover:bg-opacity-10">
                          <div className="w-10 h-10 rounded-full bg-[#006A71] mr-3"></div>
                          <div className="flex-1">
                            <p className="font-medium">Dr. Michael Chen</p>
                            <p className="text-sm text-gray-500">
                              Dermatologist
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-1">
                              ★★★★☆
                            </div>
                            <p className="text-xs text-gray-500">
                              Available Tomorrow
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-[#9ACBD0] hover:bg-opacity-10">
                          <div className="w-10 h-10 rounded-full bg-[#9ACBD0] mr-3"></div>
                          <div className="flex-1">
                            <p className="font-medium">Dr. Lisa Rodriguez</p>
                            <p className="text-sm text-gray-500">
                              Pediatrician
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-1">
                              ★★★★★
                            </div>
                            <p className="text-xs text-gray-500">
                              Available Today
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-[#006A71]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Experience Modern Healthcare?
              </h2>
              <p className="text-[#9ACBD0] mb-8 text-lg">
                Join thousands of users who are saving time with our innovative
                healthcare solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-[#006A71] py-3 px-8 rounded-full font-medium hover:bg-[#F2EFE7] transition-colors transform hover:scale-105 duration-200">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
