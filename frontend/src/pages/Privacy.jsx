import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center px-5 py-10 dark:bg-black-10">
      <div className="max-w-6xl w-full shadow-lg rounded-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Section for Image (Hidden on Mobile) */}
        <div className="w-full md:w-2/5 bg-gray-100 p-6 hidden md:flex flex-col items-center dark:bg-black-10">
          <img
            src="https://img.freepik.com/free-vector/privacy-policy-concept-illustration_114360-7478.jpg"
            alt="Privacy Illustration"
            className="w-full rounded-lg mb-4"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRau28_GXYA1DEeVWt14zMA4ztRzKvdUXcpCf15AjTFCdyArIopLUos_Bk9MF1WYA8vwU4&usqp=CAU"
            alt="Privacy Illustration"
            className="w-full rounded-lg"
          />
        </div>

        {/* Right Section - Privacy Policy Content */}
        <div className="w-full md:w-3/5 p-6 md:p-10 text-blue-5 dark:text-white-1 rounded-xl dark:bg-black-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 ">
            Privacy Policy
          </h1>

          {/* Introduction */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p>
              Welcome to <span className="font-medium">AI-MedLab</span>, a
              secure telemedicine platform connecting patients and doctors
              through video consultations. Your privacy is our priority.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside   space-y-2  ">
              <li>
                <strong>Patients:</strong> Name, Contact,email, age, Gender,
                Health Records, Payment Details.
              </li>
              <li>
                <strong>Doctors:</strong> Name, Specialization, DoctorId, Phone
                Number, Email, Consultation History.
              </li>
              <li>
                All transactions are securely processed through{" "}
                <strong>Stripe</strong>.
              </li>
              <li>
                <strong>Google OAuth:</strong> We use Google Authentication to
                streamline login.
              </li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3 ">
              How We Use Your Data
            </h2>
            <p>
              We collect data to provide seamless healthcare services,
              including:
            </p>
            <ul className="list-disc list-inside   space-y-2">
              <li>Facilitating secure video consultations.</li>
              <li>Managing health records for patients.</li>
              <li>
                Processing secure transactions via <strong>Stripe</strong>.
              </li>
              <li>Enhancing platform security and preventing fraud.</li>
            </ul>
          </section>

          {/* Security Measures */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <ul className="list-disc list-inside   space-y-2  ">
              <li>🔐 End-to-end encrypted video calls.</li>
              <li>
                💳 Secure transactions via <strong>Stripe</strong>.
              </li>
              <li>⚖️ HIPAA & GDPR compliance for legal data protection.</li>
              <li>🔑 Google OAuth for secure and seamless login.</li>
            </ul>
          </section>

          {/* Features for Patients & Doctors */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">
              Features for Patients & Doctors
            </h2>

            {/* For Patients */}
            <div className="mb-4 text-blue-5 dark:text-white-1">
              <h3 className="text-lg font-semibold  ">For Patients:</h3>
              <ul className="list-disc list-inside   space-y-2">
                <li>
                  📅 Book Video Calls: Schedule online consultations with
                  doctors.
                </li>
                <li>
                  📝 Manage Health Records: View prescriptions and past medical
                  history.
                </li>
                <li>💳 Easy Payments: Secure payments using Stripe Wallet.</li>
                <li>
                  ⭐ Feedback System: Rate and review doctors post-consultation.
                </li>
              </ul>
            </div>

            {/* For Doctors */}
            <div className="text-blue-5 dark:text-white-1">
              <h3 className="text-lg font-semibold  ">For Doctors:</h3>
              <ul className="list-disc list-inside   space-y-2">
                <li>
                  👨‍⚕️ Set UpProfile: Add specialization, working hours, and
                  services.
                </li>
                <li>
                  📅 Manage Availability: Organize appointments and working
                  hours.
                </li>
                <li>
                  💊 Write & Share Prescriptions: Send prescriptions digitally.
                </li>
                <li>
                  📋 Queue System: Keeptrack of patients in a smart queue.
                </li>
              </ul>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information at any time. If you have concerns about privacy, feel
              free to contact us.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-6 text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">Cookies & Tracking</h2>
            <p>
              We use cookies to enhance your browsing experience and improve
              website functionality. You can adjust your cookie preferences in
              your browser settings.
            </p>
          </section>

          {/* Contact Info */}
          <section className="text-center text-blue-5 dark:text-white-1">
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p>
              📧 <strong>ai-medlab@gmail.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
