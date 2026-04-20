import React, { useState, useEffect, useContext, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { FaVideo } from "react-icons/fa";
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import { AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Alert, CircularProgress } from "@mui/material";
import useDocTitle from "../hooks/useDocTitle";
import useActive from "../hooks/useActive";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import httpClient from "../httpClient";
import useOutsideClose from "../hooks/useOutsideClose";
import { useDarkMode } from "../contexts/DarkMode/DarkModeContext";

const Doctors = () => {
  useDocTitle("Doctors");
  const { isLoading, toggleLoading } = useContext(commonContext);
  const navigate = useNavigate();

  const { isDarkMode } = useDarkMode();
  const [meetModal, setMeetModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isInstantMeet, setInstantMeet] = useState(false);
  const [isConnecting, setConnecting] = useState(false);
  const [isScheduleMeet, setScheduleMeet] = useState(false);
  const [isInvDateTime, setInvDateTime] = useState(false);
  const [scheduleAlert, setScheduleAlert] = useState(0);
  const [meetScheduling, setMeetScheduling] = useState(false);
  const [curDate, setCurDate] = useState(null);
  const [curTime, setCurTime] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLowBalance, setLowBalance] = useState(false);
  const [curFee, setCurFee] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [selectedDocStatus, setSelectedDocStatus] = useState(false);
  const [selectedDocAvailable, setSelectedDocAvailable] = useState(false);
  const [selectEmail, setSelectEmail] = useState("");
  const [message, setMessage] = useState("");
  const { handleActive } = useActive(-1);
  const [selectedTime, setSelectedTime] = useState(null);
  const modalRef = useRef(null);

  const [available, setAvailable] = useState([
    { time: "08:00", available: true },
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
  ]);

  useEffect(() => {
    const userNotExists = !localStorage.getItem("usertype");
    if (userNotExists) {
      navigate("/");
    } else {
      fetchDoctors();
    }
  }, []);

  useEffect(() => {
    handleTimings();
  }, [isScheduleMeet, curDate]);

  useEffect(() => {
    httpClient
      .post("/get_wallet", {
        email: localStorage.getItem("email"),
      })
      .then((res) => {
        setBalance(res.data.wallet);
      })
      .catch(console.error);
  }, []);

  useOutsideClose(modalRef, () => {
    setMessage("");
    setMeetModal(false);
    setConnecting(false);
    httpClient.put("/delete_meet", { email: selectEmail });
  });

  const fetchDoctors = () => {
    setFetchingData(true);
    toggleLoading(true);
    httpClient
      .get("/get_status")
      .then((res) => {
        setDoctors(res.data.details);
        toggleLoading(false);
        setFetchingData(false);
      })
      .catch(() => {
        toggleLoading(false);
        setFetchingData(false);
      });
  };

  const handleMeet = () => {
    const time = new Date().getTime();
    httpClient.post("/meet_status", { email: selectEmail }).then((res) => {
      if (res.status === 200) {
        const meetLink = `/instant-meet?meetId=${time}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(
          selectEmail
        )}&name=${localStorage.getItem("username")}&age=${localStorage.getItem(
          "age"
        )}&gender=${localStorage.getItem(
          "gender"
        )}&pemail=${localStorage.getItem("email")}&fee=${curFee}`;

        httpClient
          .put("/make_meet", {
            demail: selectEmail,
            pemail: localStorage.getItem("email"),
            patient: localStorage.getItem("username"),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            link: meetLink,
          })
          .then(() => {
            localStorage.setItem("meetLink", meetLink);
            setTimeout(() => {
              httpClient
                .post("/currently_in_meet", { email: selectEmail })
                .then((res) => {
                  if (res.data.curmeet) {
                    setConnecting(false);
                    navigate(meetLink);
                  } else {
                    httpClient.put("/delete_meet", { email: selectEmail });
                    setConnecting(false);
                    setMessage(res.data.message);
                  }
                });
            }, 20000);
          });
      } else {
        setConnecting(false);
        setMessage(res.data.message);
      }
    });
  };

  const handleTimings = () => {
    if (!selectEmail) return;

    httpClient
      .post("/doctor_apo", { demail: selectEmail })
      .then((res) => {
        const appointments = res.data.upcomingAppointments;
        let times = {
          "08:00": true,
          "09:00": true,
          "10:00": true,
          "11:00": true,
          "12:00": true,
          "15:00": true,
          "16:00": true,
          "17:00": true,
          "18:00": true,
        };
        // Filter appointments to include only those in 'times' object
        const filteredAppointments = appointments.filter((item) => {
          const itemDate = item.date.split("T")[0]; // Extract YYYY-MM-DD
          const selectedDate = curDate.split("T")[0]; // Ensure same format
          return itemDate === selectedDate && times.hasOwnProperty(item.time);
        });

        // Update availability based on filtered appointments
        filteredAppointments.forEach((item) => {
          times[item.time] = false;
        });
        setAvailable(times);
      })
      .catch(console.error);
  };

  const handleScheduleClick = () => {
    setMeetScheduling(true);
    setTimeout(() => {
      setMeetScheduling(false);
      httpClient
        .post("/doctor_apo", {
          demail: selectEmail,
        })
        .then((res) => {
          if (handleSchedule(res.data.upcomingAppointments)) {
            setScheduleAlert(2);
            const datetime = `${curDate}${curTime.replace(":", "")}`;
            const link = `/instant-meet?meetId=${datetime}&selectedDoc=${selectedDoc}&selectedMail=${encodeURIComponent(
              selectEmail
            )}&name=${localStorage.getItem(
              "username"
            )}&age=${localStorage.getItem("age")}&gender=${localStorage.getItem(
              "gender"
            )}&pemail=${localStorage.getItem("email")}fee=${curFee}`;
            httpClient
              .put("/patient_apo", {
                email: localStorage.getItem("email"),
                date: curDate,
                time: curTime,
                doctor: selectedDoc,
                demail: selectEmail,
                link: link,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });

            httpClient
              .put("/doctor_apo", {
                demail: selectEmail,
                date: curDate,
                time: curTime,
                patient: localStorage.getItem("username"),
                pemail: localStorage.getItem("email"),
                link: link,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });

            httpClient
              .put("/set_appointment", {
                pemail: localStorage.getItem("email"),
                date: curDate,
                time: curTime,
                doctor: selectedDoc,
                demail: selectEmail,
                link: link,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setScheduleAlert(1);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setTimeout(() => {
        setScheduleAlert(0);
        setMeetModal(false);
      }, 4000);
    }, 2000);
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "Doctor",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="text-gray-800">
          {`Dr. ${params.row.username
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}`}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "specialization",
      headerName: "Specialization",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fee",
      headerName: "Fee",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <div>₹ {params.row.fee}</div>,
    },
    {
      field: "languages",
      headerName: "Languages",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: () => "English / Hindi",
    },
    {
      field: "ratings",
      headerName: "Ratings",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-1">
          <span>
            {params.row.noOfAppointments
              ? (params.row.noOfStars / params.row.noOfAppointments).toFixed(1)
              : "0"}
          </span>
          <AiFillStar className="text-yellow-400" />
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-1">
          <TbPointFilled
            className={
              params.row.status === "online" ? "text-green-400" : "text-red-400"
            }
          />
          <span className="font-medium">{params.row.status}</span>
        </div>
      ),
    },
    {
      field: "appointments",
      headerName: "Book an Appointment",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <button
          onClick={() => {
            if (params.row.fee > balance) {
              setLowBalance(true);
              setCurFee(params.row.fee);
            } else {
              setSelectEmail(params.row.email);
              setSelectedDocStatus(params.row.status === "online");
              setSelectedDocAvailable(params.row.isInMeet);
              setScheduleMeet(false);
              setInstantMeet(false);
              setLowBalance(false);
            }
            setSelectedDoc(
              `Dr. ${params.row.username
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}`
            );
            setMeetModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-200 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600"
        >
          BOOK
        </button>
      ),
    },
  ];

  useScrollDisable(isLoading);

  if (isLoading) return <Preloader />;

  const handleSchedule = (upcomingAppointments) => {
    for (let i = 0; i < upcomingAppointments.length; i++) {
      const now = new Date(curDate + " " + curTime);
      const d1 = new Date(
        new Date(
          upcomingAppointments[i].date + " " + upcomingAppointments[i].time
        ).getTime() -
          30 * 60000
      );
      const d2 = new Date(
        new Date(
          upcomingAppointments[i].date + " " + upcomingAppointments[i].time
        ).getTime() +
          30 * 60000
      );

      if (d1 < now && now <= d2) return false;
    }
    return true;
  };

  const checkInvDateTime = (date, time) => {
    if (!date || !time) {
      setInvDateTime(true);
      return;
    }

    const selectedDateTime = new Date(`${date} ${time}`);
    const currentDateTime = new Date();

    // Check if selected date and time are in the future
    const isValidDateTime = selectedDateTime > currentDateTime;
    setInvDateTime(!isValidDateTime);
  };

  return (
    <div className="py-24 text-center h-full dark:bg-black-6">
      <div
        className="min-h-[600px] mx-auto text-gray-800 max-w-[1300px] w-full 
   rounded-lg h-full "
      >
        <div className="flex justify-center items-center mb-6 ">
          <h3 className="text-2xl font-semibold dark:text-white-1">
            Doctor Details
          </h3>
          <button
            className={`ml-2.5 p-2 rounded ${
              fetchingData
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-3 text-white-1 hover:bg-blue-7 cursor-pointer dark:bg-blue-34 dark:hover:bg-blue-31"
            } text-white transition-all duration-300`}
            onClick={fetchDoctors}
            disabled={fetchingData}
          >
            <IoMdRefresh className={fetchingData ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="w-full flex justify-center px-4">
          <DataGrid
            rows={doctors}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            sx={{
              border: "none",
              borderRadius: "0.5rem",
              maxHeight: "600px",
              height: "100vh",
              padding: "1rem",
              boxShadow: isDarkMode
                ? "0 0 10px 1px #CABFAF"
                : "0 0 10px 1px #b0bbd8",
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                color: isDarkMode ? "white" : "black",
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-caption, & .MuiSvgIcon-root":
                {
                  color: isDarkMode && "white !important",
                },
              "& .MuiDataGrid-overlay": {
                // Fix: Added '& ' and wrapped it in quotes
                background: "none",
                backgroundColor: "transparent",
                color: isDarkMode ? "white" : "black",
              },
              "& .MuiDataGrid-virtualScroller": {
                "&::-webkit-scrollbar-track": {
                  background: isDarkMode && "#2a3454",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: isDarkMode && "#435585",
                  borderRadius: "10px",
                  zIndex: "10",
                },
              },
              "& .MuiDataGrid-toolbarContainer": {
                "& button": {
                  color: "white",
                  backgroundColor: isDarkMode ? "#435585" : "#7584ae",

                  "&:hover": {
                    backgroundColor: isDarkMode ? "#2a3454" : "#282f42",
                  },
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: isDarkMode
                  ? "1px solid #CABFAF"
                  : "1px solid #E5E7EB",
                color: isDarkMode ? "white" : "black",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: isDarkMode
                  ? "1px solid #101314"
                  : "1px solid #E5E7EB",
                color: isDarkMode ? "white" : "black",

                "& div": {
                  color: isDarkMode ? "white" : "black",
                },
                "& button": {
                  color: "white",
                  backgroundColor: isDarkMode ? "#435585" : "#7584ae",

                  "&:hover": {
                    backgroundColor: isDarkMode ? "#2a3454" : "#282f42",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Low Balance Modal */}
      <Modal
        open={meetModal && isLowBalance}
        onClose={() => {
          setMessage("");
          setMeetModal(false);
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 relative bg-white-1 dark:bg-black-0 shadow-[0_0_10px_1px_#b0bbd8]"
            ref={modalRef}
          >
            <div className="justify-between items-center border-b pb-4 mb-4 dark:border-white-7 dark:border-opacity-20">
              <IoMdClose
                className="text-blue-5 hover:text-blue-8 cursor-pointer transition-colors duration-300 ease-in-out block dark:text-white-7"
                onClick={() => setMeetModal(false)}
              />
              <h3 className="text-red-600 font-semibold text-[1em] my-4">
                Insufficient Balance
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-blue-7 text-[1.3em] font-normal dark:text-white-1">
                  Doctor Fee {`(${selectedDoc})`}
                </span>
                <span className="font-bold text-blue-7 w-12 dark:text-white-1">
                  ₹ {curFee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-7 text-[1.3em] font-normal dark:text-white-1">
                  Available Balance
                </span>
                <span className="font-bold text-blue-7 dark:text-white-1">
                  ₹ {balance}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-blue-2 dark:text-white-1 dark:border-blue-33 dark:border-opacity-30">
                <span className="text-red-600 font-semibold">
                  Required Amount
                </span>
                <span className="text-red-600 font-bold">
                  ₹ {curFee - balance}
                </span>
              </div>
            </div>

            <button
              className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3 rounded-lg hover:shadow-lg hover:from-sky-600 hover:to-blue-600 transition-all duration-300 dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600"
              onClick={() =>
                navigate(`/my-wallet?recharge=${curFee - balance}`)
              }
            >
              Recharge Wallet
            </button>
          </div>
        </div>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        open={meetModal && !isLowBalance}
        onClose={() => {
          setMessage("");
          setMeetModal(false);
          setConnecting(false);
        }}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-lg w-auto py-[14px] px-[20px] pb-[20px] relative shadow-lg border-[2px] border-sky-200 bg-white text-sky-900 text-center dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
            ref={modalRef}
          >
            <div className="justify-between items-center pb-4">
              <IoMdClose
                className="text-blue-5 hover:text-blue-8 cursor-pointer transition-colors duration-300 ease-in-out block dark:text-white-7"
                onClick={() => {
                  setMessage("");
                  setMeetModal(false);
                  setConnecting(false);
                  httpClient.put("/delete_meet", { email: selectEmail });
                }}
              />
              <h3 className="text-center border-none dark:text-white-8">
                Wanna meet?
              </h3>
            </div>

            {/* Meeting Options */}
            <div className="md:min-w-[450px]">
              <div className="flex justify-center text-white-1 mx-[25px] mb-[10px] max-sm:flex max-sm:flex-col">
                {selectedDocStatus && !selectedDocAvailable && (
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-600 m-4 text-white rounded-lg cursor-pointer hover:shadow-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 w-auto dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-800 dark:hover:to-slate-900"
                    onClick={() => {
                      setScheduleMeet(false);
                      setInstantMeet(!isInstantMeet);
                      setConnecting(false);
                    }}
                  >
                    Create an Instant meet
                  </button>
                )}
                <button
                  className="px-8 py-4 bg-grey-3 m-4 text-white-1 rounded-[8px] cursor-pointer hover:bg-blue-6 transition-all duration-300 w-auto shadow-[0_0_10px_1px_#b3b8d0;] active:bg-blue-6 dark:bg-grey-9 dark:hover:bg-blue-31 dark:active:bg-blue-31 dark:shadow-[0_0_10px_1px_#606a6f]"
                  onClick={() => {
                    const d = new Date();
                    setCurDate(
                      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                        2,
                        "0"
                      )}-${String(d.getDate()).padStart(2, "0")}`
                    );
                    setCurTime(
                      `${String(d.getHours()).padStart(2, "0")}:${String(
                        d.getMinutes()
                      ).padStart(2, "0")}`
                    );
                    setInvDateTime(true);
                    setScheduleMeet(!isScheduleMeet);
                    setInstantMeet(false);
                    setConnecting(false);
                  }}
                >
                  Schedule a meet
                </button>
              </div>

              {message && (
                <Alert
                  severity="error"
                  className="mt-4 dark:bg-red-4 dark:text-red-7"
                  sx={{
                    "& .MuiAlert-icon": {
                      color: isDarkMode && "#f5aead",
                    },
                  }}
                >
                  {message}
                </Alert>
              )}

              {/* Instant Meeting Section */}
              {isInstantMeet && (
                <div className="text-center py-4">
                  {isConnecting ? (
                    <div className="space-y-4">
                      <div className="flex justify-center items-end space-x-1">
                        {[...Array(10)].map((_, index) => (
                          <div
                            key={index}
                            className="w-1 bg-gradient-to-t rounded-full animate-wave"
                            style={{
                              animationDelay: `${index * 0.1}s,
                              height: ${(index + 1) * 8}px,
                            `,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-grey-5">
                        Connecting to doctor...
                      </p>
                    </div>
                  ) : (
                    <button
                      className="flex items-center justify-center gap-2 mx-auto px-6 py-3 
                        bg-blue-3 text-white rounded-lg hover:bg-blue-5
                        transition-all duration-300 shadow-md text-white-1 dark:bg-blue-34 dark:hover:bg-blue-31"
                      onClick={() => {
                        setConnecting(true);
                        setMessage("");
                        handleMeet();
                      }}
                    >
                      <span>Start Meeting</span>
                      <FaVideo />
                    </button>
                  )}
                </div>
              )}

              {/* Schedule Meeting Section */}
              {isScheduleMeet && (
                <div className="pb-[25px] mb-1">
                  <h4 className="dark:text-white-8">Select Date and Time</h4>

                  {isInvDateTime && (
                    <Alert
                      severity="error"
                      className="mb-4 dark:bg-red-4 dark:text-red-7"
                      sx={{
                        "& .MuiAlert-icon": {
                          color: isDarkMode && "#f5aead",
                        },
                      }}
                    >
                      Please select a future date and time
                    </Alert>
                  )}

                  {scheduleAlert !== 0 && (
                    <Alert
                      severity={scheduleAlert === 1 ? "error" : "success"}
                      className={`mb-4 ${
                        scheduleAlert === 1
                          ? "dark:bg-red-4 dark:text-red-7"
                          : "dark:bg-green-9 dark:text-green-6"
                      }`}
                      sx={{
                        "& .MuiAlert-icon": {
                          color:
                            isDarkMode &&
                            (scheduleAlert === 1 ? "#f5aead" : "#4dff99"),
                        },
                      }}
                    >
                      {scheduleAlert === 1
                        ? "Doctor is unavailable at selected time"
                        : "Meeting scheduled successfully"}
                    </Alert>
                  )}

                  <div className="w-full flex justify-center">
                    <div className="space-y-4 w-full ">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
                        value={curDate || ""}
                        onChange={(e) => {
                          const selectedDate = e.target.value;
                          setCurDate(selectedDate);
                          checkInvDateTime(selectedDate, curTime);
                        }}
                        className="py-[11px] px-[12px] cursor-pointer border-[2px] border-blue-3 rounded-[8px] text-black dark:text-white-8 dark:[color-scheme:dark] "
                      />

                      <div className="w-full flex justify-center">
                        <div className="grid grid-cols-3 gap-[5px] w-[70%] max-md:w-full border-[2px] border-blue-3 rounded-[8px] p-[5px] dark:border-blue-37">
                          {/* {console.log(available)} */}
                          {Object.keys(available).map((time, index) => (
                            <button
                              key={index}
                              className={`border-[2px] border-blue-3 dark:border-blue-37 rounded-[8px] cursor-pointer flex items-center justify-center py-[10px] px-[5px] ${
                                available[time]
                                  ? `border-[2px] border-blue-3 dark:border-blue-37 ${
                                      selectedTime === time &&
                                      "bg-blue-1 dark:bg-grey-10"
                                    }`
                                  : "bg-blue-2 cursor-not-allowed dark:bg-blue-37"
                              }`}
                              disabled={!available[time]} // Accessing the value for each time slot
                              onClick={() => {
                                if (available[time]) {
                                  // Check availability for each time slot
                                  handleActive(index);
                                  checkInvDateTime(curDate, time);
                                  setCurTime(time);
                                  setSelectedTime(time);
                                }
                              }}
                            >
                              <TbPointFilled
                                className={
                                  available[time]
                                    ? "text-[#0f0]"
                                    : "text-[#f00]"
                                } // Using available[time] here
                              />
                              <span className="mr-[6px] ml-[2px] md:text-base max-md:text-lg max-md:text-[10px] min-w-[50%] dark:text-white-8">
                                {time}
                              </span>
                              <AiOutlineClockCircle className="dark:text-white-8" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        className={`mt-10 bg-blue-3 text-white-1 py-[12px] px-[12px] rounded-[5px] my-[8px] mx-[5px] transition-all duration-300 hover:bg-blue-5 active:bg-blue-5 disabled:bg-blue-5 disabled:cursor-not-allowed dark:bg-blue-24 dark:hover:bg-blue-31`}
                        onClick={handleScheduleClick}
                        disabled={
                          isInvDateTime ||
                          meetScheduling ||
                          !curDate ||
                          !curTime
                        }
                      >
                        {meetScheduling ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "Schedule Meeting"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Doctors;