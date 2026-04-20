import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import commonContext from "../../contexts/common/commonContext";
import AccountForm from "../form/Accountform";
import cartContext from "../../contexts/cart/cartContext";
import { AiOutlineShoppingCart } from "react-icons/ai";
import useOutsideClose from "../../hooks/useOutsideClose";
import httpClient from "../../httpClient";
import { RiFileList3Line } from "react-icons/ri";
import Profile from "./Profile";
import { FiMail } from "react-icons/fi";
import { FiPhoneCall } from "react-icons/fi";
import { CiMenuFries } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
// import logo from "../../assets/header.png";
import { useDarkMode } from "../../contexts/DarkMode/DarkModeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { TiUserDeleteOutline } from "react-icons/ti";

const Header = () => {
  const { toggleForm, userLogout, toggleProfile } = useContext(commonContext);
  const { cartItems, setCartItems } = useContext(cartContext);
  const [isSticky, setIsSticky] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const curPath = location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const windowWidth = window.innerWidth;
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleIsSticky = () =>
      window.scrollY >= 50 ? setIsSticky(true) : setIsSticky(false);
    const handleIsScrolled = () =>
      window.scrollY >= 1 ? setIsScrolled(true) : setIsScrolled(false);

    window.addEventListener("scroll", handleIsSticky);
    window.addEventListener("scroll", handleIsScrolled);

    return () => {
      window.removeEventListener("scroll", handleIsSticky);
      window.removeEventListener("scroll", handleIsScrolled);
    };
  }, [isSticky, isScrolled]);

  const updatestatus = () => {
    httpClient.put("/doc_status", { email: localStorage.getItem("email") });
    userLogout();
  };

  useEffect(() => {
    localStorage.getItem("email") &&
      localStorage.getItem("email") !== "undefined" &&
      httpClient
        .post("/get_cart", { email: localStorage.getItem("email") })
        .then((res) => {
          setCartItems(res.data.cart);
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);

  const dropdownRef = useRef();
  const sidebarRef = useRef();

  useOutsideClose(dropdownRef, () => {
    setShowDropdown(false);
  });
  useOutsideClose(sidebarRef, () => setSideBarOpen(false));

  const handleLoginClick = () => {
    setIsSignup(false);
    toggleForm(true);
  };

  const handleRegisterClick = () => {
    setIsSignup(true);
    toggleForm(true);
  };

  return (
    <>
      {localStorage.getItem("username") &&
        localStorage.getItem("username") !== "undefined" &&
        localStorage.getItem("usertype") === "patient" && (
          <div
            className={`overflow-x-hidden flex justify-between items-center py-4 px-40 border-b-[1px] border-blue-8 h-full transition-all duration-300 ease-out max-lg:px-5 max-sm:px-4 max-sm:py-4 max-xs:p-2 dark:bg-black-3 dark:text-white-1 dark:hover:text-blue-2 dark:border-grey-3 ${
              isScrolled ? "opacity-0 h-0 p-0" : ""
            }`}
          >
            <div
              className={`flex justify-center items-center flex-wrap text-grey-3 transition-transform duration-500 max-lg:justify-start dark:hover:text-white-1 dark:text-blue-2 ${
                isScrolled
                  ? "-translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <Link
                to="mailto:ai-medlab@gmail.com"
                className="flex justify-center items-center transition-all duration-300 ease-out hover:text-[#333] mr-[20px] max-xs:mr-0 dark:text-white-1 dark:text-opacity-80 dark:hover:text-opacity-100"
              >
                <FiMail className="text-[0.9em] leading-[1.4rem] mr-[5px]" />
                <p className="text-[0.9em] leading-[1.4rem]">
                  ai-medlab@gmail.com
                </p>
              </Link>
              <Link
                to="tel:+911234567890"
                className="flex justify-center items-center transition-all duration-300 ease-out hover:text-[#333] dark:text-white-1 dark:text-opacity-80 dark:hover:text-opacity-100"
              >
                <FiPhoneCall className="text-[0.9em] leading-[1.4rem] mr-[5px]" />
                <p className="text-[0.9em] leading-[1.4rem]">+91 12345 67890</p>
              </Link>
            </div>
            <div
              className={`transition-transform duration-500 ${
                isScrolled
                  ? "translate-x-full opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <Link
                to="/doctors"
                className="text-blue-5 font-bold transition-all duration-300 ease-out hover:text-blue-7 dark:text-white-1 dark:text-opacity-80 dark:hover:text-opacity-100"
              >
                Appointment
              </Link>
            </div>
          </div>
        )}
      <header
        id=""
        className={`z-[999] w-full text-sky-900 md:px-8 pt-6 pb-6 transition-colors duration-200 ease-linear h-full bg-white/80 backdrop-blur-sm dark:text-slate-100 ${
          isSticky
            ? "top-0 sticky bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 shadow-md"
            : "dark:bg-slate-900"
        }`}
      >
        <div className="max-w-[1440px] mx-auto max-sm:px-2 px-6 max-xl:max-w-[1280px] max-lg:max-w-[1024px] max-md:max-w-[768px] max-sm:max-w-full h-full">
          <div className="grid grid-cols-12 md:gap-4 max-sm:w-full">
            <h2 className="flex items-center col-span-7 max-lg:col-span-5 max-md:col-span-6 max-sm:col-span-6 max-md:mt-1">
              <Link to="/">
                <div className="flex items-center gap-2 text-2xl font-bold text-sky-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-200 transition-colors">
                  <span className="text-red-500">❤️</span>
                  <span className="bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">AI-MedLab</span>
                </div>
              </Link>
            </h2>
            {!localStorage.getItem("username") && (
              <div className="col-span-5 flex justify-end gap-4 max-md:col-span-6">
                <div className="space-x-4 items-center md:flex md:justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="py-[0.7rem] max-md:py-2 max-md:px-4 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:from-sky-600 hover:to-blue-600 max-md:text-sm dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    className="max-md:hidden py-[0.7rem] px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:from-sky-600 hover:to-blue-600 max-md:text-sm dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600"
                  >
                    Register
                  </button>
                </div>
                <div className="rounded-full pt-2 cursor-pointer flex justify-end items-center col-span-1">
                  {isDarkMode ? (
                    <FaSun
                      className="w-8 h-8 max-sm:w-7 max-sm:h-7 text-yellow-400 hidden dark:block bg-slate-700 p-2 max-sm:p-1.5 rounded-full align-middle dark:hover:bg-slate-600 transition-colors"
                      onClick={toggleDarkMode}
                    />
                  ) : (
                    <FaMoon
                      className="w-8 h-8 max-sm:w-7 max-sm:h-7 bg-sky-50 text-slate-600 dark:hidden p-2 max-sm:p-1.5 rounded-full hover:bg-sky-100 transition-colors"
                      onClick={toggleDarkMode}
                    />
                  )}
                </div>
              </div>
            )}

            {localStorage.getItem("username") !== null &&
            localStorage.getItem("username") !== undefined ? (
              windowWidth >= 800 ? (
                <nav
                  className={`hidden md:flex items-center ${
                    localStorage.getItem("usertype") == "doctor"
                      ? " xl:ml-32 lg:gap-8 max-lg:gap-7"
                      : "gap-8 max-lg:gap-7"
                  }`}
                >
                  <div
                    className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                      curPath === "/home"
                        ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                        : "dark:text-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => navigate("/home")}
                      className="cursor-pointer font-bold"
                    >
                      HOME
                    </span>
                  </div>

                  {localStorage.getItem("usertype") === "patient" && (
                    <div
                      className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                        curPath === "/doctors"
                          ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                          : "dark:text-slate-300 text-slate-700"
                      }`}
                    >
                      <span
                        onClick={() => navigate("/doctors")}
                        className="cursor-pointer font-bold"
                      >
                        DOCTORS
                      </span>
                    </div>
                  )}
                  <div
                    className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                      curPath === "/disease-prediction"
                        ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                        : "dark:text-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => navigate("/disease-prediction")}
                      className="cursor-pointer font-bold"
                    >
                      MODEL
                    </span>
                  </div>

                  <div
                    className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                      curPath === "/buy-medicines"
                        ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                        : "dark:text-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => navigate("/buy-medicines")}
                      className="cursor-pointer font-bold relative"
                    >
                      MEDICINES
                      <span className="cursor-pointer font-bold px-[5px] py-[3px] bg-gradient-to-r from-sky-600 to-cyan-600 absolute -top-[14px] text-white -right-[35px] rounded-full hover:shadow-lg text-[9px] z-9999 dark:from-cyan-500 dark:to-blue-500">
                        20% off
                      </span>
                    </span>
                  </div>

                  <div
                    className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                      curPath === "/health-blogs"
                        ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                        : "dark:text-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => navigate("/health-blogs")}
                      className="cursor-pointer font-bold"
                    >
                      INFO
                    </span>
                  </div>
                  <div
                    className={`hover:text-sky-600 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-cyan-300 ${
                      curPath === "/about"
                        ? "text-sky-700 border-b-[2px] border-sky-600 dark:text-cyan-300 dark:border-cyan-400"
                        : "dark:text-slate-300 text-slate-700"
                    }`}
                  >
                    <span
                      onClick={() => navigate("/about")}
                      className="cursor-pointer font-bold"
                    >
                      ABOUTUS
                    </span>
                  </div>

                  <div
                    className="relative hover:text-sky-600 transition-all duration-300 text-[0.9em] pt-[13px] pb-2 text-slate-700 dark:text-slate-300 dark:hover:text-cyan-300"
                    ref={dropdownRef}
                  >
                    <span
                      className="cursor-pointer font-bold"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      ACCOUNT
                    </span>
                    {showDropdown && (
                      <div className="absolute top-[5rem] right-0 w-[17rem] bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-6 text-[0.9rem] rounded-lg text-slate-900 border-[1px] border-sky-200 dark:border-slate-600 z-[1000] transition-all duration-200 ease-in-out shadow-lg">
                        <div>
                          <h4 className="font-semibold space-x-[0.5px] text-sky-700 dark:text-cyan-300">
                            <span className="text-[1em] opacity-95 hover:opacity-100 text-slate-900 dark:text-slate-100">
                              Hello! &nbsp;
                            </span>
                            <span className="dark:text-slate-300">
                              {localStorage.getItem("username")}
                            </span>
                          </h4>
                          <p className="text-[0.8rem] mt-2 text-slate-600 dark:text-slate-400">
                            Have a great health!!
                          </p>
                          <button
                            type="button"
                            className="mt-4 py-[0.8rem] px-4 rounded-lg border-[1px] transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 hover:border-sky-500 text-sky-600 border-sky-300 bg-sky-50 dark:bg-slate-700 dark:text-cyan-400 dark:border-slate-600 dark:hover:border-cyan-400 mr-[10px]"
                            onClick={() => {
                              setShowDropdown(false);
                              toggleProfile(true);
                            }}
                          >
                            Profile
                          </button>
                          <button
                            type="button"
                            className="mt-4 py-[0.8rem] px-4 rounded-lg border-[1px] transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-500 hover:border-sky-500 text-sky-600 border-sky-300 bg-sky-50 dark:bg-slate-700 dark:text-cyan-400 dark:border-slate-600 dark:hover:border-cyan-400 mr-[10px]"
                            onClick={() => {
                              setShowDropdown(false);
                              localStorage.getItem("usertype") === "doctor"
                                ? updatestatus()
                                : userLogout();
                              navigate("/");
                            }}
                          >
                            Logout
                          </button>
                          <div className="my-4 border-t-[1px] border-sky-200 dark:border-slate-600"></div>
                          <ul className="text-slate-700 dark:text-slate-300">
                            <li className="mb-[0.7rem] flex hover:text-sky-600 dark:hover:text-cyan-300 transition-colors">
                              <IoWalletOutline className="text-[1.4em] mr-[5px]" />
                              <Link
                                to="/my-wallet"
                                onClick={() => setShowDropdown(false)}
                              >
                                My Wallet
                              </Link>
                            </li>
                            <li className="mb-[0.7rem] flex hover:text-sky-600 dark:hover:text-cyan-300 transition-colors">
                              <AiOutlineShoppingCart className="text-[1.4em] mr-[5px]" />
                              <Link
                                to="/my-cart"
                                onClick={() => setShowDropdown(false)}
                              >
                                My Cart
                              </Link>
                              <span className="bg-blue-3 text-[0.8rem] rounded-[3px] ml-[10px] py-[0.1rem] px-[0.4rem] text-white">
                                {cartItems.length}
                              </span>
                            </li>
                            <li className="mb-[0.7rem] flex">
                              <RiFileList3Line className="text-[1.4em] mr-[5px]" />
                              <Link
                                to="/my-orders"
                                onClick={() => setShowDropdown(false)}
                              >
                                My Orders
                              </Link>
                            </li>
                            <li className="flex">
                              <TiUserDeleteOutline className="text-[1.4em] mr-[5px]" />
                              <Link
                                to="/delete-account"
                                onClick={() => setShowDropdown(false)}
                              >
                                Delete Account
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="rounded-full cursor-pointer flex justify-end items-center relative -left-2">
                    {isDarkMode ? (
                      <FaSun
                        className="w-8 h-8 max-sm:w-7 max-sm:h-7 text-white-1 hidden dark:block bg-blue-8 p-2 max-sm:p-1.5 rounded-full align-middle dark:bg-blue-25 dark:text-white-1"
                        onClick={toggleDarkMode}
                      />
                    ) : (
                      <FaMoon
                        className="w-8 h-8 max-sm:w-7 max-sm:h-7 bg-white-1 text-blue-8 dark:hidden p-2 max-sm:p-1.5 rounded-full"
                        onClick={toggleDarkMode}
                      />
                    )}
                  </div>
                </nav>
              ) : (
                <div className="col-span-6 flex justify-end items-center mt-2 absolute right-4">
                  <div className="rounded-full cursor-pointer flex justify-end items-center">
                    {isDarkMode ? (
                      <FaSun
                        className="w-8 h-8 max-sm:w-7 max-sm:h-7 text-white-1 hidden dark:block bg-blue-8 p-2 max-sm:p-1.5 rounded-full align-middle dark:bg-blue-25 dark:text-white-1"
                        onClick={toggleDarkMode}
                      />
                    ) : (
                      <FaMoon
                        className="w-8 h-8 max-sm:w-7 max-sm:h-7 bg-white-1 text-blue-8 dark:hidden p-2 max-sm:p-1.5 rounded-full"
                        onClick={toggleDarkMode}
                      />
                    )}
                  </div>
                  <div
                    id="sidebar"
                    className="w-auto h-7 max-sm:relative ml-8 max-sm:ml-3 z-[1000]"
                  >
                    <div
                      className="text-[1.5em] cursor-pointer font-bold dark:font-extrabold"
                      onClick={() => {
                        setSideBarOpen((prev) => !prev);
                        setShowDropdown(false);
                      }}
                    >
                      {isSideBarOpen ? <MdClose /> : <CiMenuFries />}
                    </div>
                    <div
                      className={`relative transition-all duration-300 ease-in ${
                        isSideBarOpen
                          ? "visible opacity-100"
                          : "hidden opacity-0"
                      }`}
                      ref={sidebarRef}
                    >
                      <nav className="absolute flex flex-col top-[30px] right-0 gap-6 bg-blue-1 z-[99] py-4 px-20 rounded-[20px] dark:bg-gray-800">
                        <div
                          className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center ${
                            curPath === "/home"
                              ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                              : "dark:text-white-1 text-blue-8"
                          }`}
                        >
                          <span
                            onClick={() => {
                              navigate("/home");
                              setSideBarOpen((prev) => !prev);
                            }}
                            className="cursor-pointer font-bold text-center w-full"
                          >
                            HOME
                          </span>
                        </div>

                        {localStorage.getItem("usertype") === "patient" && (
                          <div
                            className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center ${
                              curPath === "/doctors"
                                ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                                : "dark:text-white-1 text-blue-8"
                            }`}
                          >
                            <span
                              onClick={() => {
                                navigate("/doctors");
                                setSideBarOpen((prev) => !prev);
                              }}
                              className="cursor-pointer font-bold text-center w-full"
                            >
                              DOCTORS
                            </span>
                          </div>
                        )}
                        <div
                          className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center ${
                            curPath === "/disease-prediction"
                              ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                              : "dark:text-white-1 text-blue-8"
                          }`}
                        >
                          <span
                            onClick={() => {
                              navigate("/disease-prediction");
                              setSideBarOpen((prev) => !prev);
                            }}
                            className="cursor-pointer font-bold text-center w-full"
                          >
                            MODEL
                          </span>
                        </div>

                        <div
                          className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center ${
                            curPath === "/buy-medicines"
                              ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                              : "dark:text-white-1 text-blue-8"
                          }`}
                        >
                          <span
                            onClick={() => {
                              navigate("/buy-medicines");
                              setSideBarOpen((prev) => !prev);
                            }}
                            className="cursor-pointer font-bold relative text-center w-full "
                          >
                            MEDICINES
                            <span className="cursor-pointerfont-bold px-[5px] py-[3px] bg-blue-8 absolute -top-[14px] text-white-1 -right-[40px] rounded-[40px] hover:bg-blue-9 text-[10px] z-9999 dark:bg-blue-25 dark:text-white-1">
                              20% off
                            </span>
                          </span>
                        </div>

                        <div
                          className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-blue-2 ${
                            curPath === "/health-blogs"
                              ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                              : "dark:text-white-1 text-blue-8"
                          }`}
                        >
                          <span
                            onClick={() => {
                              navigate("/health-blogs");
                              setSideBarOpen((prev) => !prev);
                            }}
                            className="cursor-pointer font-bold text-center w-full"
                          >
                            HEALTH BLOGS
                          </span>
                        </div>

                        {/* About Us link for mobile */}
                        <div
                          className={`hover:text-blue-9 content-none transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center dark:hover:text-blue-2 ${
                            curPath === "/about"
                              ? "text-blue-9 border-b-[2px] border-blue-9 dark:text-blue-32 dark:border-blue-5"
                              : "dark:text-white-1 text-blue-8"
                          }`}
                        >
                          <span
                            onClick={() => {
                              navigate("/about");
                              setSideBarOpen((prev) => !prev);
                            }}
                            className="cursor-pointer font-bold text-center w-full"
                          >
                            ABOUT US
                          </span>
                        </div>

                        <div
                          className={`hover:text-blue-9 content-none  transition-all duration-300 text-[0.9em] pt-[13px] pb-2 inline-flex items-center text-blue-8 dark:text-white-1`}
                        >
                          <span
                            className="font-bold text-center w-full"
                            onClick={() => {
                              setSideBarOpen((prev) => !prev);
                              setShowDropdown(true);
                            }}
                          >
                            ACCOUNT
                          </span>
                        </div>
                      </nav>
                    </div>
                    {showDropdown && (
                      <div
                        className={`absolute top-[4rem] right-0 w-[17rem] bg-blue-6 p-6 text-[0.9rem] rounded-[3px] text-[#eee] border-[1px] border-grey-3  z-[1000] transition-all duration-200 ease-in-out ${
                          showDropdown && "active"
                        }`}
                        ref={dropdownRef}
                      >
                        <h4 className="font-semibold space-x-[0.5px]  text-blue-2">
                          <span className=" text-[1em] opacity-95 hover:opacity-100 text-white-1">
                            Hello! &nbsp;
                          </span>
                          {localStorage.getItem("username")}
                        </h4>
                        <p className="text-[0.8rem] mt-2">
                          Have a great health!!
                        </p>
                        <button
                          type="button"
                          className="mt-4 py-[0.8rem] px-4 rounded-[4px] border-[1px]  transition-all duration-300 hover:text-blue-1 hover:border-blue-5 hover:bg-blue-5 text-blue-1 border-blue-3 mr-[10px] bg-blue-3"
                          onClick={() => {
                            setShowDropdown(false);
                            toggleProfile(true);
                          }}
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          className="mt-4 py-[0.8rem] px-4 rounded-[4px] border-[1px]  transition-all duration-300 hover:text-blue-1 hover:border-blue-5 hover:bg-blue-5 text-blue-1 border-blue-3 mr-[10px]"
                          onClick={() => {
                            setShowDropdown(false);
                            localStorage.getItem("usertype") === "doctor"
                              ? updatestatus()
                              : userLogout();
                            navigate("/");
                          }}
                        >
                          Logout
                        </button>
                        <div className="my-4 border-t-[1px] border-grey-2"></div>
                        <ul>
                          <li className="mb-[0.7rem] flex">
                            <IoWalletOutline className="text-[1.4em] mr-[5px]" />
                            <Link
                              to="/my-wallet"
                              onClick={() => setShowDropdown(false)}
                            >
                              My Wallet
                            </Link>
                          </li>
                          <li className="mb-[0.7rem] flex">
                            <AiOutlineShoppingCart className="text-[1.4em] mr-[5px]" />
                            <Link
                              to="/my-cart"
                              onClick={() => setShowDropdown(false)}
                            >
                              My Cart
                            </Link>
                            <span className="bg-blue-3 text-[0.8rem] rounded-[3px] ml-[10px] py-[0.1rem] px-[0.4rem] text-white">
                              {cartItems.length}
                            </span>
                          </li>
                          <li className="flex">
                            <RiFileList3Line className="text-[1.4em] mr-[5px]" />
                            <Link
                              to="/my-orders"
                              onClick={() => setShowDropdown(false)}
                            >
                              My Orders
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </header>

      <AccountForm isSignup={isSignup} setIsSignup={setIsSignup} />
      <Profile />
    </>
  );
};

export default Header;
