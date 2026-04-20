import React, { Component } from "react";

class Patient2 extends Component {
  state = {
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    next_button_available: "",
    all_answer: [],
  };

  handleOnChange = (e) => {
    const { name, value } = e.target;

    // Update the corresponding question state dynamically
    this.setState(
      {
        [name]: value,
      },
      () => {
        // Update the "next_button_available" state and prepare answers
        const allAnswered = [
          "question_1",
          "question_2",
          "question_3",
          "question_4",
          "question_5",
          "question_6",
        ].every((key) => this.state[key] !== "");

        const allAnswers = [
          {
            question: "Patient is overweight or obese",
            answer: this.state.question_1,
          },
          {
            question: "Patient smokes cigarettes",
            answer: this.state.question_2,
          },
          {
            question: "Patient has been recently injured",
            answer: this.state.question_3,
          },
          {
            question: "Patient has high cholesterol",
            answer: this.state.question_4,
          },
          {
            question: "Patient has hypertension",
            answer: this.state.question_5,
          },
          { question: "Patient has diabetes", answer: this.state.question_6 },
        ];

        this.setState(
          {
            next_button_available: allAnswered ? "Available" : "Not available",
            all_answer: allAnswers,
          },
          () => {
            // Callback to parent component with updated answers
            this.props.callback(allAnswers, this.state.next_button_available);
          }
        );
      }
    );
  };

  render() {
    const questions = [
      {
        title: "I am overweight",
        stateKey: "question_1",
        name: "question_1",
      },
      {
        title: "I smoke cigarettes",
        stateKey: "question_2",
        name: "question_2",
      },
      {
        title: "I have been recently injured",
        stateKey: "question_3",
        name: "question_3",
      },
      {
        title: "I have high cholesterol",
        stateKey: "question_4",
        name: "question_4",
      },
      {
        title: "I have hypertension",
        stateKey: "question_5",
        name: "question_5",
      },
      {
        title: "I have diabetes",
        stateKey: "question_6",
        name: "question_6",
      },
    ];

    return (
      <div className="pt-8 text-blue-6 dark:text-white-9">
        <div className="width-full">
          <h2 className="text-lg mb-4 text-gray-5 dark:font-thin">
            Please check all the statements below that apply to you
          </h2>
          <p className="mb-6 text-gray-4">Select one answer in each row</p>
        </div>

        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.name} className="space-y-2">
              <p className="text-blue-4 mb-2 dark:text-white-9">
                {question.title}
              </p>
              <div className="flex gap-8 items-center max-sm:flex-col max-sm:items-start max-sm:gap-3">
                {[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                  { value: "Patient doesn't know", label: "I don't know" },
                ].map((option) => (
                  <label
                    key={`${question.name}-${option.value}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.name}
                      value={option.value}
                      checked={this.state[question.stateKey] === option.value}
                      onChange={this.handleOnChange}
                      className="appearance-none my-0 mx-[5px] w-[1.2em] h-[1.2em] bg-blue-1 content-none cursor-pointer outline-none rounded-[15px] -top-[2px] -left-[1px] relative inline-block visible border-[4px] border-blue-1 checked:bg-blue-8 dark:bg-yellow-11 dark:border-yellow-11 dark:checked:bg-black-12"
                    />
                    <span className="text-blue-4 dark:text-white-9">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Patient2;
