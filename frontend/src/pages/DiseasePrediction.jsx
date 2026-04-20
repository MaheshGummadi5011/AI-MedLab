import React, { Component, useContext, useEffect } from "react";
import Home from "../components/diseasePrediction/Home";
// import Patient from "../components/diseasePrediction/Patient1";
import Patient2 from "../components/diseasePrediction/Patient2";
import Symptom from "../components/diseasePrediction/Symptom";
import Disease from "../components/diseasePrediction/Disease";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import { useNavigate } from "react-router-dom";

class DP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Home", // Name of the current component
      tab_name: "Welcome",
      tab_progress: 25,
      button_is_disabled: false, // Next button disabled if not agreed to terms
      home_button_checked: false, //Check if terms are agreed
      age: localStorage.getItem("age") ? localStorage.getItem("age") : "18", //Patient Default Age
      button_name: "Next", //Button name retry or next
      gender: localStorage.getItem("gender")
        ? localStorage.getItem("gender").toUpperCase()
        : "Male", //Default gender
      home_nav_icon: <p>1</p>,
      patient_nav_icon: <p>2</p>,
      symptom_nav_icon: <p>3</p>,
      disease_nav_icon: <p>4</p>,
      patient_question: localStorage.getItem("patient_question")
        ? localStorage.getItem("patient_question")
        : [],
      home_nav_value: false,
      patient_nav_value: false,
      symptom_nav_value: false,
      disease_nav_value: false,
      disease_possibility: [],
      user_symptoms: [],
      user_symptom_length: 0,
    };
    // this.symptomPage = React.createRef();
    this.symptomRef = React.createRef();
  }

  get_next_page = (e) => {
    // eslint-disable-next-line default-case
    switch (this.state.current_page) {
      case "Home":
        return this.setState({
          current_page: "Patient-2",
          tab_progress: 50,
          home_nav_value: true,
          button_is_disabled: true,
          home_button_checked: true,
          button_name: "Next",
          // patient_2_next_button_disabled: true,
        });
      // case "Patient":
      //   return this.setState({
      //     current_page: "Patient-2",
      //     button_name: "Next",
      //     patient_2_next_button_disabled: true,
      //   });
      case "Patient-2":
        return this.setState({
          current_page: "Symptom",
          tab_progress: 75,
          button_name: "Finish",
          patient_nav_value: true,
          button_is_disabled: true,
          user_symptom_length: 0,
          home_button_checked: true,
          patient_question: localStorage.getItem("patient_question")
            ? JSON.parse(localStorage.getItem("patient_question")) // Convert back to array
            : [],
        });
      case "Symptom":
        // Call the Symptom component's sendSymptomsToBackend method
        if (this.symptomRef.current) {
          this.symptomRef.current.sendSymptomsToBackend();
        }
        return this.setState({
          current_page: "Disease",
          button_name: "Retry",
          tab_progress: 100,
          symptom_nav_value: true,
          disease_nav_value: true,
          button_is_disabled: true,
          home_button_checked: true,
          patient_question: localStorage.getItem("patient_question")
            ? JSON.parse(localStorage.getItem("patient_question"))
            : [],
        });
      case "Disease":
        return this.setState({
          tab_progress: 25,
          current_page: "Home", // Name of the current component
          button_is_disabled: false, // Next button disabled if not agreed to terms
          home_button_checked: false, //Check if terms are agreed
          age: "18", //Patient Default Age
          button_name: "Next", //Button name retry or next
          gender: "Male", //Default gender
          male: true, // patient checkbox
          female: false, // patient checkbox
          home_nav_icon: <p>1</p>,
          patient_nav_icon: <p>2</p>,
          symptom_nav_icon: <p>3</p>,
          disease_nav_icon: <p>4</p>,
          home_nav_value: false,
          patient_nav_value: false,
          symptom_nav_value: false,
          disease_nav_value: false,
          disease_possibility: [],
          user_symptoms: [],
          user_symptom_length: "",
        });
    }
  };

  get_gender = (e) => {
    if (e.target.value === "male") {
      this.setState({
        male: true,
        female: false,
        gender: "Male",
      });
    } else if (e.target.value === "female") {
      this.setState({
        male: false,
        female: true,
        gender: "Female",
      });
    }
  };

  get_age_event = (e) => {
    this.setState({ age: e.target.value });
  };

  // symptomInfoCallback = (data, data2) => {
  //   this.setState((prevState) => ({
  //     disease_possibility: data,
  //     user_symptoms:
  //       prevState.user_symptoms.length > 0 ? prevState.user_symptoms : data2,
  //     user_symptom_length: data2.length,
  //   }));
  // };

  patient_2_callback = async (data) => {
    let d = data.filter((key) => {
      return key.answer !== "";
    });
    let avl = data.length !== d.length;
    this.setState({
      patient_question: data,
      button_is_disabled: avl,
      symptom_nav_value: true,
    });
    localStorage.setItem("patient_question", JSON.stringify(data));
  };

  updateSymptoms = (user_symptoms) => {
    this.setState({ user_symptoms });
    this.setState({ user_symptom_length: user_symptoms.length });
    // Enable button only if there are at least 2 symptoms for more accurate prediction
    if (user_symptoms.length >= 2) {
      this.setState({ button_is_disabled: false });
    } else {
      this.setState({ button_is_disabled: true });
    }
  };

  updateDiseasePossibility = (disease_possibility) => {
    this.setState({ disease_possibility });
    if (disease_possibility.length > 0) {
      this.setState({ button_is_disabled: false });
    }
  };

  home_button_check_event = (e) => {
    if (e.target.checked === true) {
      return this.setState({
        button_is_disabled: false,
        home_button_checked: true,
        home_nav_value: true,
        patient_nav_value: true,
      });
    } else if (e.target.checked === false) {
      return this.setState({
        button_is_disabled: true,
        home_button_checked: false,
        home_nav_value: false,
        patient_nav_value: false,
      });
    }
  };

  handleResetClick = () => {};

  get_previous_page = (e) => {
    // eslint-disable-next-line default-case
    switch (this.state.current_page) {
      case "Disease":
        return this.setState({
          current_page: "Symptom",
          button_name: "Finish",
          tab_progress: 75,
          disease_nav_value: false,
          user_symptoms: [],
          user_symptom_length: 0,
          button_is_disabled: false,
          home_button_checked: true,
          patient_question: this.state.patient_question,
        });
      case "Symptom":
        return this.setState({
          current_page: "Patient-2",
          symptom_page_button: "",
          tab_progress: 50,
          button_name: "Next",
          button_is_disabled: true,
          home_button_checked: true,
          patient_nav_value: false,
          disease_possibility: [],
          user_symptoms: [],
          user_symptom_length: 0,
        });
      case "Patient-2":
        return this.setState({
          current_page: "Home",
          button_name: "Next",
          home_nav_icon: <p>1</p>,
          home_nav_value: false,
          button_is_disabled: false,
          home_button_checked: false,
          user_symptoms: [],
          user_symptom_length: 0,
          tab_progress: 25,
        });
      // case "Patient":
      //   return this.setState({
      //     current_page: "Home",
      //     home_nav_icon: <p>1</p>,
      //     home_nav_value: false,
      //     button_is_disabled: true,
      //     home_button_checked: false,
      //     tab_progress: 25,
      //     user_symptom_length: 1,
      //   });
    }
  };

  showPage = (e) => {
    const { current_page, home_button_checked, age, gender, result } =
      this.state;
    // eslint-disable-next-line default-case
    switch (current_page) {
      case "Home":
        return (
          <Home
            isChecked={home_button_checked}
            checked={this.home_button_check_event}
          />
        );
      // case "Patient":
      //   return <Patient male={male} female={female} gender={this.get_gender} age={age} ageChange={this.get_age_event} />;
      case "Patient-2":
        return <Patient2 callback={this.patient_2_callback} />;

      case "Symptom":
        return (
          <Symptom
            ref={this.symptomRef}
            user_symptoms={this.state.user_symptoms}
            disease_possibility={this.state.disease_possibility}
            getPossibleDisease={this.symptomInfoCallback}
            pageCallback={this.symptom_page_button_callback}
            setResult={(result) => this.setState({ result })}
            updateDiseasePossibility={this.updateDiseasePossibility}
            updateSymptoms={this.updateSymptoms}
          />
        );
      case "Disease":
        return this.state.disease_possibility.length > 0 ? (
          <Disease
            patientInfo={this.state.patient_question}
            disease_possibility={this.state.disease_possibility}
            gender={gender}
            age={age}
            result={result}
          />
        ) : (
          <div className="text-center p-4">
            <p
              ref={(el) => {
                if (el) {
                  setTimeout(() => {
                    if (el && this.state.disease_possibility.length === 0) {
                      el.innerHTML = 
                      `<div class="text-red-500 mb-4">
                         <h3>Error predicting disease</h3>
                         <p>We encountered an issue processing your symptoms.</p>
                       </div>
                       <div>
                         <p>This could be due to:</p>
                         <ul class="list-disc text-left ml-8 mt-2">
                           <li>Not enough symptoms selected</li>
                           <li>Connection issues with our prediction service</li>
                           <li>The symptoms combination doesn't match known patterns</li>
                         </ul>
                         <p class="mt-4">Please go back and try again with different symptoms.</p>
                       </div>`;
                    }
                  }, 5000); // Reduced timeout to 5 seconds
                }
              }}
              className="text-blue-7 dark:text-white-1"
            >
              <div className="flex justify-center items-center flex-col">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-9 mb-4"></div>
                Loading disease possibility...
              </div>
            </p>
          </div>
        );
    }
  };

  renderResetButton = () => {
    return (
      <button
        className="usa-button usa-button--secondary"
        onClick={this.symptomPage.current}
      >
        Reset
      </button>
    );
  };

  render() {
    const {
      tab_progress,
      button_is_disabled,
      user_symptom_length,
      current_page,
      home_button_checked,
      button_name,
    } = this.state;

    return (
      <div
        id="disease-prediction"
        className="py-28 flex justify-center items-center dark:bg-black-6"
      >
        {/* main-content */}
        <main className="px-8 pt-12 max-w-[1000px] w-[95vw] border-[1px] border-grey-3 rounded-[1rem] max-sm:p-6 max-sm:pb-0 dark:border-white-1 dark:border-opacity-25 dark:bg-black-0 shadow-[0_0_5px_1px_#E4F6FF]">
          {/* first-grid  */}
          <div className="grid grid-cols-12 max-md:grid-cols-none ">
            <div className="col-span-3 relative max-md:col-span-full">
              {/* side-menu-list */}
              <ul className="list-none leading-6 md:pl-2 absolute w-full">
                <li
                  id=""
                  className="py-[3px] px-[3px] text-[1rem] rounded-[13px] w-[25%]  bg-blue-1 absolute right-0 md:hidden"
                >
                  <div
                    className={`${
                      tab_progress === 25 &&
                      "bg-blue-7 w-[25%] h-[2px] rounded-[10px] dark:bg-blue-8"
                    } ${
                      tab_progress === 50 &&
                      "bg-blue-7 w-[50%] h-[2px] rounded-[10px] dark:bg-blue-8"
                    } ${
                      tab_progress === 75 &&
                      "bg-blue-7 w-[75%] h-[3px] rounded-[10px] dark:bg-blue-8"
                    } ${
                      tab_progress === 100 &&
                      "bg-blue-7 w-[100%] h-[2px] rounded-[10px] dark:bg-blue-8"
                    }`}
                  ></div>
                </li>
                <li
                  className={`mt-2 py-[10px] px-[20px] max-md:px-2 ${
                    current_page === "Home" &&
                    "text-[1rem] font-bold text-blue-9 border-l-[2px] border-l-blue-9  max-md:border-b-[2px] max-md:border-b-blue-9 max-md:border-l-0 max-md:w-auto max-md:inline-block dark:border-blue-28 dark:text-blue-33"
                  } ${
                    tab_progress > 25 &&
                    " max-md:hidden border-l-[2px] border-l-blue-9 text-blue-8 dark:border-blue-28 dark:text-white-1"
                  }`}
                >
                  Welcome
                </li>
                <li
                  className={`py-[10px] px-[20px] max-md:px-2 ${
                    tab_progress === 50 &&
                    "text-[1rem] font-bold text-blue-9 border-l-[2px] border-l-blue-9  max-md:border-b-[2px] max-md:border-b-blue-9 max-md:border-l-0 max-md:w-auto max-md:inline-block dark:border-blue-28 dark:text-blue-33"
                  } ${
                    tab_progress < 50 &&
                    "max-md:hidden dark:text-white-1 dark:text-opacity-60"
                  } ${
                    tab_progress > 50 &&
                    "max-md:hidden border-l-[2px] border-l-blue-9 text-blue-8 dark:border-blue-28 dark:text-white-1"
                  }`}
                >
                  Patient
                </li>
                <li
                  className={`py-[10px] px-[20px] max-md:px-2${
                    tab_progress === 75 &&
                    "text-[1rem] font-bold text-blue-9 border-l-[2px] border-l-blue-9  max-md:border-b-[2px] max-md:border-b-blue-9 max-md:border-l-0 max-md:w-auto max-md:inline-block dark:border-blue-28 dark:text-blue-33"
                  } ${
                    tab_progress < 75 &&
                    "max-md:hidden dark:text-white-1 dark:text-opacity-60"
                  } ${
                    tab_progress > 75 &&
                    "max-md:hidden border-l-[2px] border-l-blue-9 text-blue-8 dark:border-blue-28 dark:text-white-1"
                  }`}
                >
                  Symptom
                </li>
                <li
                  className={`py-[10px] px-[20px] max-md:px-2 ${
                    tab_progress === 100 &&
                    "text-[1rem] font-bold text-blue-9 border-l-[2px] border-l-blue-9  max-md:border-b-[2px] max-md:border-b-blue-9 max-md:border-l-0 max-md:w-auto max-md:inline-block dark:border-blue-28 dark:text-blue-33"
                  } ${
                    tab_progress < 100 &&
                    "max-md:hidden dark:text-white-1 dark:text-opacity-60"
                  } ${
                    tab_progress > 100 &&
                    "max-md:hidden border-l-[2px] border-l-blue-9 text-blue-8 dark:border-blue-28 dark:text-white-1"
                  }`}
                >
                  Disease
                </li>
              </ul>
            </div>
            <div
              id=""
              className="col-span-9 rounded-[0.5rem] pb-12 max-md:col-span-full mt-4 max-md:mt-20"
            >
              <div className="h-[50vh] overflow-y-auto pb-16">
                {this.showPage()}
              </div>
            </div>
          </div>

          <div className="m-4 border-[1px] border-t-blue-2 dark:border-white-1 dark:border-opacity-40"></div>

          <div className="second-grid">
            <div
              id="buttonsSection"
              className="py-4 px-8 flex justify-between items-center"
            >
              <button
                disabled={this.state.current_page === "Home"}
                onClick={this.get_previous_page}
                className="bg-blue-3 border-[1px] border-blue-5 text-white-1 py-[10px] px-[12px] rounded-[5px] mb-[8px] mx-[20px] font-sans transition-all duration-300 ease-in-out hover:bg-blue-5 active:bg-blue-5 disabled:bg-blue-5 disabled:cursor-not-allowed dark:bg-blue-24 dark:hover:bg-blue-31 dark:disabled:bg-blue-24"
              >
                Back
              </button>
              <button
                className={`bg-blue-3 border-[1px] border-blue-5 text-white-1 py-[10px] px-[12px] rounded-[5px] mb-[8px] mx-[20px] font-sans transition-all duration-300 ease-in-out hover:bg-blue-5 active:bg-blue-5 disabled:bg-blue-5 disabled:cursor-not-allowed dark:bg-blue-24 dark:hover:bg-blue-31 dark:disabled:bg-blue-24`}
                disabled={!home_button_checked || button_is_disabled}
                type="submit"
                onClick={this.get_next_page}
              >
                {button_name}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const DiseasePrediction = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const navigate = useNavigate();

  const userNotExists =
    !localStorage.getItem("username") ||
    localStorage.getItem("username") === "undefined";

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 2000);
    }
    // eslint-disable-next-line
  }, []);

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  return <DP />;
};

export default DiseasePrediction;
