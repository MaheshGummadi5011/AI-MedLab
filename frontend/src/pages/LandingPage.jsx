import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDocTitle from "../hooks/useDocTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { MdExpandMore } from "react-icons/md";
import { TbStethoscope, TbHeartPlus } from "react-icons/tb";
import { BsRobot } from "react-icons/bs";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt, FaHospital } from "react-icons/fa";
import { IoAccessibility } from "react-icons/io5";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
// import bg from "../assets/landing-bg.png";
import bg from "../assets/Hero.png";
import need from "../assets/need.png";
import profiles from "../data/teamData";
import TestimonialSection from "../components/landingPage/TestimonialCarousel";

const TypingEffect = ({ text, speed = 100, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && displayedText.length < text.length) {
      // Typing
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (!isDeleting && displayedText.length === text.length) {
      // Pause at the end before starting to delete
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, speed * 10);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting
      timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length - 1));
      }, speed / 2);
    } else if (isDeleting && displayedText.length === 0) {
      // Reset to start typing again
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, speed * 5);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, text, speed]);

  return (
    <div className="w-full">
      <h2
        className={`${className} md:overflow-hidden md:whitespace-nowrap inline-block`}
        style={
          {
            // width: `${text.length}ch`,
            // minWidth: `${text.length}ch`
          }
        }
      >
        {displayedText}
      </h2>
    </div>
  );
};

const LandingPage = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const faqRef = useRef(null);

  useEffect(() => {
    toggleLoading(true);
    setTimeout(() => toggleLoading(false), 2000);
  }, []);

  useScrollDisable(isLoading);
  useDocTitle();
  const navigate = useNavigate();

  const handleFaqClick = (index) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleOutsideClick = (event) => {
    if (faqRef.current && !faqRef.current.contains(event.target)) {
      setOpenFaqIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  const handleOnCLick = () => {
    navigate("/doctors");
  };

  const faqs = [
    {
      question: "What is AI-MedLab?",
      answer:
        "It is the web application that connects patients to the right doctor or allow them to choose a doctor as per their need. It provides information about users, doctors, news, appointments, and prescriptions. It also allows users to create instant meetings with doctors, and buy medicines. It allows users to check their health status by using his/her symptoms.",
    },
    {
      question:
        "Can we get a free account in AI-MedLab and use all its features for free?",
      answer:
        "Yes, Ofcourse. You can use all the features provided by AI-MedLab for free.",
    },
    {
      question: "Can we book an appointment at any time?",
      answer:
        "Yes. You can book an appointment of a doctor if he/she is free at that time.",
    },
    {
      question: "Is there a way to test our health?",
      answer:
        "Yes. You can test your health by a Model that predicts the disease probability in the future.",
    },
    {
      question: "Can we purchase the medicines from here?",
      answer: "Yes. You can purchase the medicines from AI-MedLab store.",
    },
  ];

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div>
        {/* Hero Section - Enhanced with seamless transition to services */}
        <section className="relative bg-gradient-to-b from-[#f8faff] via-[#f2f6ff] to-[#eefaff] dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 overflow-hidden pt-20 pb-0">
          {/* Background elements */}
          <div className="absolute top-0 right-0 h-full w-full bg-curvy-shape dark:bg-curvy-shape-dark bg-no-repeat bg-left bg-cover opacity-80 dark:opacity-50 z-0"></div>
          
          {/* Enhanced decorative elements */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-50 rounded-full mix-blend-overlay filter blur-3xl opacity-60 dark:bg-blue-900 dark:opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-10 right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 dark:bg-indigo-900 dark:opacity-30"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:bg-blue-800 dark:opacity-25 animate-float-slow"></div>
          <div className="absolute bottom-16 right-1/4 w-64 h-64 bg-blue-100/80 rounded-full mix-blend-multiply filter blur-3xl opacity-40 dark:bg-blue-700 dark:opacity-20 animate-float-delayed"></div>

          {/* Content container */}
          <div className="relative z-[1] w-full">
            <div className="container mx-auto px-6 py-10 md:py-12">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                {/* Text content */}
                <div className="w-full md:w-1/2">
                  <div className="max-w-xl">
                    <TypingEffect
                      text="Healing Hands Caring Hearts"
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300 h-16 mb-6"
                    />

                    <p className="text-lg text-blue-800/90 dark:text-gray-300 mb-8 max-w-lg">
                      Connecting patients and doctors, no matter the distance. We are
                      dedicated to your wellbeing & committed to your care.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => navigate("/doctors")}
                        className="px-8 py-3 bg-gradient-to-r text-white-1 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                      >
                        Find a Doctor
                      </button>
                      <button
                        onClick={() => navigate("/disease-prediction")}
                        className="px-8 py-3 bg-white hover:bg-gray-50 text-blue-700 font-medium rounded-lg border border-blue-200 transition-all shadow-sm hover:shadow-md hover:border-blue-300 dark:bg-transparent dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
                      >
                        Health Check
                      </button>
                    </div>
                  </div>
                </div>

                
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                  <div className="relative w-full max-w-lg transform transition-all duration-500 hover:scale-[1.02]">
                  
                    <div className="relative z-10 flex items-center justify-center">
                      <img
                        src={bg}
                        alt="Healthcare professionals"
                        className="w-full h-auto object-contain max-h-[350px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[450px] transform hover:scale-[1.03] transition-all duration-700 animate-float-slow"
                        style={{
                          filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))"
                        }}
                      />
                    
                    
                    </div>

                   

                    {/* Floating accent elements - positioned for better responsiveness */}
                    <div className="absolute -top-3 -left-3 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg dark:from-blue-500 dark:to-blue-700 dark:text-blue-50 dark:shadow-blue-900/50 z-20 animate-float">
                      <TbStethoscope className="text-xl sm:text-2xl relative z-10" />
                    </div>
                    <div className="absolute -bottom-3 -left-3 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg dark:from-indigo-500 dark:to-indigo-700 dark:text-indigo-50 dark:shadow-indigo-900/50 z-20 animate-float-delayed">
                      <MdOutlineHealthAndSafety className="text-xl sm:text-2xl relative z-10" />
                    </div>
                    
                    {/* Repositioned additional floating accent */}
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md dark:from-blue-400 dark:to-indigo-600 z-20 animate-float-slow opacity-80">
                      <IoAccessibility className="text-sm sm:text-lg relative z-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wave separator to create seamless transition to services */}
            <div className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-white-1 dark:fill-black-7">
                <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* services-section - Modernized */}
        <section className="pt-10 pb-24 bg-white-1 dark:bg-black-7">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3 dark:bg-blue-900/30 dark:text-blue-300">
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-yellow-1">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                We provide a range of services designed to meet all your healthcare
                needs in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="group relative bg-white rounded-xl p-8 shadow-md transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-br before:from-blue-50 before:to-blue-100 before:opacity-0 before:transition-opacity hover:before:opacity-100 hover:shadow-blue-200 hover:-translate-y-1 hover:scale-[1.02] dark:bg-black-2 dark:before:from-blue-900/10 dark:before:to-blue-800/20 dark:hover:shadow-blue-900/30 border border-blue-50 hover:border-blue-200 dark:border-blue-900/20 dark:hover:border-blue-700/70">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 text-blue-600 transition-all dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-700 dark:group-hover:shadow-blue-700/40">
                  <TbStethoscope className="text-3xl group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="relative z-10 mb-3 text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors dark:text-white-1 dark:group-hover:text-blue-300">
                  Experienced Doctors
                </h3>
                <p className="relative z-10 text-gray-600 dark:text-gray-300 group-hover:text-blue-900/80 dark:group-hover:text-blue-100/90">
                  Connect with qualified doctors through live video calls and receive
                  personalized care and prescriptions from anywhere.
                </p>
                <div className="relative z-10 mt-8">
                  <button
                    onClick={() => navigate("/doctors")}
                    className="px-4 py-2 rounded-lg flex items-center text-blue-600 font-medium transition-all dark:text-blue-400 dark:group-hover:text-white"
                  >
                    Connect Now
                    <svg
                      className="ml-2 w-5 h-5 group-hover:animate-pulse group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 -rotate-45 translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>

              {/* Service Card 2 */}
              <div className="group relative bg-white rounded-xl p-8 shadow-md transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-br before:from-orange-50 before:to-orange-100 before:opacity-0 before:transition-opacity hover:before:opacity-100 hover:shadow-orange-200 hover:-translate-y-1 hover:scale-[1.02] dark:bg-black-2 dark:before:from-orange-900/10 dark:before:to-orange-800/20 dark:hover:shadow-orange-900/30 border border-orange-50 hover:border-orange-200 dark:border-orange-900/20 dark:hover:border-orange-700/70">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100 text-orange-600 transition-all dark:bg-orange-900/30 dark:text-orange-400 dark:group-hover:bg-orange-700 dark:group-hover:shadow-orange-700/40">
                  <BsRobot className="text-3xl group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="relative z-10 mb-3 text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors dark:text-white-1 dark:group-hover:text-orange-300">
                  Health Prediction
                </h3>
                <p className="relative z-10 text-gray-600 dark:text-gray-300 group-hover:text-orange-900/80 dark:group-hover:text-orange-100/90">
                  Assess your health status with our advanced AI-powered disease
                  detection model to catch potential issues early.
                </p>
                <div className="relative z-10 mt-8">
                  <button
                    onClick={() => navigate("/disease-prediction")}
                    className="px-4 py-2 rounded-lg flex items-center text-orange-600 font-medium transition-all dark:text-orange-400 dark:group-hover:text-white"
                  >
                    Check Your Health
                    <svg
                      className="ml-2 w-5 h-5 group-hover:animate-pulse group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 -rotate-45 translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>

              {/* Service Card 3 */}
              <div className="group relative bg-white rounded-xl p-8 shadow-md transition-all duration-300 overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-br before:from-red-50 before:to-red-100 before:opacity-0 before:transition-opacity hover:before:opacity-100 hover:shadow-red-200 hover:-translate-y-1 hover:scale-[1.02] dark:bg-black-2 dark:before:from-red-900/10 dark:before:to-red-800/20 dark:hover:shadow-red-900/30 border border-red-50 hover:border-red-200 dark:border-red-900/20 dark:hover:border-red-700/70">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 text-red-600 transition-all dark:bg-red-900/30 dark:text-red-400 dark:group-hover:bg-red-700 dark:group-hover:shadow-red-700/40">
                  <GiMedicines className="text-3xl group-hover:scale-125 transition-transform" />
                </div>
                <h3 className="relative z-10 mb-3 text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors dark:text-white-1 dark:group-hover:text-red-300">
                  Pharmacy Store
                </h3>
                <p className="relative z-10 text-gray-600 dark:text-gray-300 group-hover:text-red-900/80 dark:group-hover:text-red-100/90">
                  Buy medications securely through our integrated pharmacy service
                  with doorstep delivery and professional guidance.
                </p>
                <div className="relative z-10 mt-8">
                  <button
                    onClick={() => navigate("/medicines")}
                    className="px-4 py-2 rounded-lg flex items-center text-red-600 font-medium transition-all dark:text-red-400"
                  >
                    Browse Medicines
                    <svg
                      className="ml-2 w-5 h-5 group-hover:animate-pulse group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 -rotate-45 translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why proper healthcare section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-black-8 dark:to-black-7">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-2/5 mb-10 md:mb-0">
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-lg from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400"></div>
                  <img
                    src={need}
                    alt="Healthcare importance"
                    className="relative z-10 w-full rounded-lg "
                  />
                </div>
              </div>

              <div className="w-full md:w-3/5 md:pl-16">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3 dark:bg-blue-900/30 dark:text-blue-300">
                  Why It Matters
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 dark:text-blue-33">
                  Why Proper Healthcare Is Essential
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 mr-4 dark:bg-blue-900/30 dark:text-blue-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-white-1">
                      WHO recommends 44.5 doctors per 10,000 people but India has
                      only 22 per 10k people creating a major supply demand
                      mismatch.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 mr-4 dark:bg-blue-900/30 dark:text-blue-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-white-1">
                      Local doctors may fail to provide the best consultation as
                      they lack the expertise & experience found in specialized
                      medical centers.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 mr-4 dark:bg-blue-900/30 dark:text-blue-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-white-1">
                      Thus all-in-one online hospital was created. It offers a
                      disease prediction system, pharmacy, and integrated payments.
                    </p>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 mr-4 dark:bg-blue-900/30 dark:text-blue-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-white-1">
                      This platform provides access to quality healthcare from
                      anywhere, improving healthcare outcomes and accessibility.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/about")}
                  className="mt-8 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white-1 font-medium rounded-lg transition-all shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Learn More About Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* testimonials-section */}
        <section className="bg-white-1 dark:bg-black-10">
          <TestimonialSection />
        </section>

        {/* FAQ section - Redesigned */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-black-10 dark:to-black-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Image column */}
              <div className="lg:w-5/12">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl dark:from-blue-500 dark:to-indigo-400"></div>
                  <img
                    src="faq-img.png"
                    alt="Frequently Asked Questions"
                    className="relative z-10 w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />

                  {/* Floating icons for visual interest */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-lg dark:bg-blue-900/50 dark:text-blue-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-lg dark:bg-amber-900/50 dark:text-amber-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* FAQ content column */}
              <div className="lg:w-7/12" ref={faqRef}>
                <div className="text-left mb-10">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3 dark:bg-blue-900/30 dark:text-blue-300">
                    FAQ
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4 dark:text-white-1">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Find answers to common questions about our services and platform
                  </p>
                </div>

                <div className="space-y-4">
                  {faqs.map((item, index) => (
                    <Accordion
                      key={index}
                      sx={{
                        backgroundColor: openFaqIndex === index ? "#4A4CB2" : "#7584ae",
                        color: "#FFFFFF",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        marginBottom: "16px",
                        border: "none",
                        outline: "none",
                        transition: "all 0.2s ease",
                        ":hover": {
                          boxShadow: "0px 0px 15px 2px rgba(59, 130, 246, 0.5)",
                        },
                      }}
                      className="dark:bg-blue-34"
                      expanded={openFaqIndex === index}
                      onChange={() => handleFaqClick(index)}
                    >
                      <AccordionSummary
                        expandIcon={<MdExpandMore style={{ color: "#FFFFFF", fontSize: "24px" }} />}
                        className="expand-icon"
                        sx={{
                          padding: "16px",
                          "& .MuiAccordionSummary-content": {
                            margin: "8px 0",
                          },
                        }}
                      >
                        <div className="text-left text-lg font-medium">{item.question}</div>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          backgroundColor: "#FFFFFF",
                          color: "#4A4CB2",
                          borderRadius: "0 0 8px 8px",
                          padding: "4px",
                          margin: "0 8px 8px 8px",
                        }}
                        className="dark:bg-[#000]"
                      >
                        <div className="w-full p-6 rounded-lg bg-white-1 text-blue-7 text-left dark:text-white-1 dark:bg-[#000]">
                          {item.answer}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>

                <div className="mt-10">
                  <button
                    onClick={() => navigate("/contact")}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Have more questions? Contact Us
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section - Improved for dark mode */}
          <div className="container mx-auto px-6 mt-24">
            <div className="relative bg-gradient-to-r from-blue-1 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl 
            dark:from-blue-900 dark:to-indigo-900 dark:bg-gradient-to-br border border-blue-300/20 dark:border-blue-500/30">
              {/* Enhanced decorative elements for dark mode */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl dark:bg-blue-400/10"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl dark:bg-indigo-400/10"></div>
                {/* Additional decorative elements for dark mode */}
                <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-transparent dark:bg-blue-300/5 rounded-full blur-xl hidden dark:block"></div>
                <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-transparent dark:bg-indigo-300/5 rounded-full blur-xl hidden dark:block"></div>
              </div>
              
              {/* Content with better dark mode styling */}
              <div className="relative px-8 py-16 md:py-20 text-white">
                <div className="flex flex-col md:flex-row items-center md:items-start max-w-6xl mx-auto">
                  <div className="w-full md:w-7/12 text-center md:text-left mb-10 md:mb-0 md:pr-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-blue-7 dark:text-blue-100">
                      Ready to Experience Better Healthcare?
                    </h2>
                    <p className="text-lg text-white/90 mb-10 max-w-xl dark:text-blue-100/90">
                      Join thousands of patients who have already discovered the convenience of AI-MedLab's comprehensive healthcare platform.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <button
                        onClick={() => navigate("/signup")}
                        className="px-8 py-3.5 bg-white hover:bg-gray-100 text-blue-700 font-medium rounded-lg transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1
                        dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white dark:shadow-blue-900/50"
                      >
                        Sign Up Now
                      </button>
                      <button
                        onClick={() => navigate("/doctors")}
                        className="px-8 py-3.5 bg-transparent hover:bg-white/20 text-white font-medium rounded-lg border-2 border-white/70 hover:border-white transition-all hover:-translate-y-1
                        dark:border-blue-400/70 dark:hover:border-blue-300 dark:hover:bg-blue-800/30"
                      >
                        Browse Doctors
                      </button>
                    </div>
                  </div>
                  
                  {/* Right side with decorative graphics - enhanced for dark mode */}
                  <div className="w-full md:w-5/12 flex justify-center">
                    <div className="relative w-72 h-72">
                      {/* Main circle - better dark mode coloring */}
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-600/30 animate-pulse-slow"></div>
                      
                      {/* Inner decorative elements - enhanced for dark mode */}
                      <div className="absolute inset-8 rounded-full bg-white/10 dark:bg-blue-400/10 backdrop-blur-sm border border-white/20 dark:border-blue-400/30"></div>
                      <div className="absolute inset-16 rounded-full bg-white/5 dark:bg-blue-500/10 flex items-center justify-center">
                        <div className="text-5xl">
                          <TbHeartPlus className="text-white drop-shadow-lg dark:text-blue-100" />
                        </div>
                      </div>
                      
                      {/* Floating icons with dark mode colors */}
                      <div className="absolute top-5 right-10 w-12 h-12 bg-blue-200/90 dark:bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 dark:text-blue-100 shadow-lg animate-float">
                        <TbStethoscope className="text-xl" />
                      </div>
                      <div className="absolute bottom-12 right-0 w-10 h-10 bg-indigo-200/90 dark:bg-indigo-600/80 backdrop-blur-sm rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-100 shadow-lg animate-float-delayed">
                        <IoMdMail className="text-lg" />
                      </div>
                      <div className="absolute bottom-16 left-5 w-14 h-14 bg-cyan-200/90 dark:bg-cyan-600/50 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-100 shadow-lg animate-float-slow">
                        <FaHospital className="text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom wave with better dark mode coloring */}
              <div className="absolute bottom-0 left-0 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto fill-blue-10 dark:fill-blue-900">
                  <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
