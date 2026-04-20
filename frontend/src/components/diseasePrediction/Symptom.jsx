import React, { Component } from "react";
import { Diseases } from "../../data/diseases";
import { Symptoms } from "../../data/symptoms";

class Symptom extends Component {
  state = {
    gender: this.props.gender,
    age: this.props.age,
    user_symptoms: this.props.userSymptoms || [],
    disease_possibility: this.props.disease_possibility || [],
    searched: "",
  };

  API_URL =
    `${import.meta.env.VITE_MODEL_URL || "https://ai-medlab.onrender.com"}/predict`;

  sendSymptomsToBackend = async () => {
    // Check if there are symptoms to send
    if (!this.state.user_symptoms || this.state.user_symptoms.length === 0) {
      console.error("No symptoms selected");
      alert("Please select at least one symptom before proceeding.");
      return;
    }

    console.log("Sending symptoms to backend:", this.state.user_symptoms);
    console.log("Using API URL:", this.API_URL);

    // Retry logic with exponential backoff
    const maxRetries = 3;
    const timeoutMs = 15000; // 15 seconds timeout
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        const response = await fetch(this.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.user_symptoms),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Received result:", result);
        
        if (result && Array.isArray(result) && result.length > 0) {
          this.setState({ disease_possibility: result });
          this.props.updateDiseasePossibility(result);
        } else {
          console.error("Invalid result format:", result);
          this.props.updateDiseasePossibility([]);
        }
        return; // Success - exit retry loop
        
      } catch (error) {
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt === maxRetries) {
          // Final attempt failed
          let errorMessage = "Failed to predict disease.";
          
          if (error.name === "AbortError") {
            errorMessage = "Request timed out. Make sure the model service is running on port 5002.\n\nTroubleshooting:\n1. Check if models/app.py is running\n2. Ensure port 5002 is not blocked\n3. Try a different symptom combination";
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage = "Cannot connect to model service on port 5002.\n\nMake sure to run: python models/app.py";
          }
          
          console.error("Error:", error);
          alert(errorMessage);
          this.props.updateDiseasePossibility([]);
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  };

  addSymptom = (symptom) => {
    if (!this.state.user_symptoms.includes(symptom)) {
      this.setState(
        (prevState) => {
          const newSymptoms = [symptom, ...prevState.user_symptoms];
          return { user_symptoms: newSymptoms, searched: "" };
        },
        () => this.props.updateSymptoms(this.state.user_symptoms)
      );
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searched: e.target.value });
  };

  on_click_reset_button = () => {
    this.setState(
      {
        user_symptoms: [],
        disease_with_possibility: [],
      },
      () => this.props.updateSymptoms([], [])
    );
  };

  deleteSymptomButtonEvent = (symptomToDelete) => {
    this.setState((prevState) => ({
      user_symptoms: prevState.user_symptoms.filter(
        (s) => s !== symptomToDelete
      ),
    }));
  };

  render() {
    return (
      <div className="leading-9 pt-4">
        <div className="grid grid-cols-7">
          {/* Search Input */}
          <div className="col-span-3 max-md:col-span-full relative">
            <input
              className="border-0 outline-none usa-input border-b-[1px] border-b-blue-6 transition-colors duration-200 ease-in-out box-border p-2 text-blue-7 w-[95%] focus:border-b-blue-6 focus:border-b-[2px] dark:text-white-1"
              type="text"
              value={this.state.searched}
              onChange={this.handleSearchChange}
              placeholder="Search Symptoms"
            />
            <ul className="w-full h-[30vh] overflow-y-scroll text-grey-3 list-none leading-9 pt-2 pl-0 scrollbar-none">
              {Symptoms.filter((symptom) =>
                symptom
                  .toLowerCase()
                  .includes(this.state.searched.toLowerCase())
              ).map((symptom) => (
                <li
                  key={symptom}
                  className="px-0 transition-all ease-in-out duration-200 rounded-[5px] my-0"
                >
                  <button
                    onClick={() => this.addSymptom(symptom)}
                    className="px-4 my-0 py-1 hover:bg-blue-1 hover:cursor-pointer transition-all ease-in-out duration-200 hover:text-blue-9 border-0 w-full h-full text-left text-base dark:hover:bg-black-8 dark:hover:text-blue-33"
                  >
                    {symptom}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Symptoms */}
          <div className="col-span-4 max-md:col-span-full">
            <ul className="list-none p-4">
              {this.state.user_symptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="bg-blue-9 text-white-1 py-2 px-2 rounded-xl text-[1rem] m-[5px] inline-block"
                >
                  {symptom}
                  <button
                    onClick={() => this.deleteSymptomButtonEvent(symptom)}
                    className="ml-2 inline-flex items-center justify-center text-center align-middle border-none w-6 h-7 bg-white-1 text-blue-9 rounded-xl text-[0.8rem] font-semibold px-[0.2rem] py-[0.5rem] transition-all duration-200 ease hover:cursor-pointer hover:bg-blue-1"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-7 flex justify-center items-center">
          <button
            onClick={this.on_click_reset_button}
            className="border-none outline-none bg-blue-3 border-[1px] border-blue-5 text-white-1 rounded-[5px] mx-[8px] my-[5px] font-sans transition-all duration-300 ease-in-out hover:bg-blue-5 active:bg-blue-5 disabled:bg-blue-5 disabled:cursor-not-allowed px-[12px] py-[9px] dark:bg-blue-24 dark:hover:bg-blue-31 dark:disabled:bg-blue-24"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}

export default Symptom;