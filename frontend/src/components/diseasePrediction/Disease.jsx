import React, { Component } from "react";

class Disease extends Component {
  state = {
    gender: this.props.gender,
    age: this.props.age,
    patientInfo:
      JSON.parse(localStorage.getItem("patient_question") || "[]") ||
      this.props.patient_question ||
      [], // Initialize patientInfo as an empty array
    disease_possibility: this.props.disease_possibility || [], // To store the diseases with possibilities
  };

  get_current_html = () => {
    const filtered_list = this.state.disease_possibility.filter(
      (e) => e.probability
    );
    filtered_list.sort(
      (a, b) =>
        b.probability - a.probability || a.disease.localeCompare(b.disease)
    );

    return filtered_list.length !== 0 ? (
      <div className="text-blue-7 py-2 px-4 leading-[1.7]">
        <div className="text-blue-9 py-4 px-0 dark:text-blue-21">
          <h3>Patient gender: {this.state.gender}</h3>
          <h3>Patient age: {this.state.age}</h3>
        </div>
        <h2 className="text-blue-7 dark:text-white-1">Patient Information</h2>
        <div className="px-0 py-2 border-t-[2px] border-blue-9 dark:border-blue-29">
          {this.state.patientInfo.length > 0 ? (
            this.state.patientInfo.map((key, id) => (
              <div
                className={`px-0 py-2 dark:text-white-1 ${
                  id > 0 && "border-top-[1px] border-blue-9 dark:border-blue-29"
                }`}
                key={id}
              >
                <p>{key.question}</p>
                <p>{key.answer}</p>
              </div>
            ))
          ) : (
            <p>No patient information available.</p>
          )}
        </div>
        <div className="py-4 px-0 text-blue-7 dark:text-white-1">
          <h2>Diagnosis Report</h2>
          {filtered_list.map((key, id) => (
            <div
              className="px-0 py-2 border-t-[2px] border-blue-9 text-blue-7 dark:border-blue-29 dark:text-white-1"
              key={id}
            >
              <div className="flex justify-between items-center flex-wrap py-4 px-0">
                <div className="flex justify-between items-center flex-wrap">
                  <h4 className="text-[1.2rem]">{key.disease}</h4>
                  <a
                    href={`https://en.wikipedia.org/wiki/${key.name}`}
                    title={"wikipedia"}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="bg-blue-9 text-white-1 leading-[1.5rem] py-0 px-[0.6rem] rounded-[2rem] ml-4 text-no no-underline focus:outline-none dark:border-blue-29"
                  ></a>
                </div>
                <div className="flex justify-between items-center flex-wrap">
                  <p>
                    Probability{" "}
                    <span className="text-blue-9 font-semibold dark:text-white-1">
                      {key.probability * 100}%
                    </span>
                  </p>
                  <div className="bg-[#ccc] w-full h-[4px] ml-2 rounded-full">
                    <div
                      style={{ width: `${key.probability * 100}%` }}
                      className="h-full bg-blue-9 dark:bg-blue-29 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="border-t-[1px] border-white-1">
                <h4 className="mt-4">Description</h4>
                <p>{key.description}</p>
                <h4 className="mt-5">Precautions</h4>
                <ul className="list-none">
                  {key.precautions.map((precaution, index) => (
                    <li
                      key={index}
                      className="py-[0.2rem] px-[0.2rem] rounded-[0.5rem]"
                    >
                      🔹{precaution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600 rounded shadow-md">
          <p className="flex items-center font-bold">
            <span className="mr-2">⚠️</span>
            Always visit a doctor if you have any symptoms of a disease or call your local hospital
          </p>
          <p className="mt-1 text-sm">This tool is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </div>
    ) : (
      <div className="text-blue-7 py-2 px-4 leading-[1.7] dark:text-white-1">
        <div className="text-blue-9 py-4 px-0">
          <h3>Patient gender: {this.props.gender}</h3>
          <h3>Patient age: {this.props.age}</h3>
        </div>
        <p>
          Cannot determine possible diseases due to lack of symptoms. Please
          retry the analysis with actual symptoms.
        </p>
        <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600 rounded shadow-md">
          <p className="flex items-center font-bold">
            <span className="mr-2">⚠️</span>
            Always visit a doctor if you have any symptoms of a disease or call your local hospital
          </p>
          <p className="mt-1 text-sm">This tool is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </div>
    );
  };

  render() {
    return <div id="Disease">{this.get_current_html()}</div>;
  }
}

export default Disease;
