import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const AnimatedCounter = ({ endValue, duration, inView }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) {
      let startValue = 0;
      const increment = endValue / (duration / 10);

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          startValue = endValue;
          clearInterval(timer);
        }
        setValue(Math.round(startValue));
      }, 10);

      return () => clearInterval(timer);
    }
  }, [inView, endValue, duration]);

  return <span>{value}</span>;
};

const DetailsBar = () => {
  const details = [
    { id: 1, label: "Happy Customers", value: 100, suffix: "+" },
    { id: 2, label: "Satisfied Patients", value: 100000, suffix: "+" },
    { id: 3, label: "Certified Doctors", value: 1000, suffix: "+" },
    { id: 4, label: "Successful Appointments", value: 500000, suffix: "+" },
    { id: 5, label: "Ratings", value: 4.9, suffix: "★" },
  ];

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {details.map((detail) => (
          <InViewCard
            key={detail.id}
            label={detail.label}
            value={detail.value}
            suffix={detail.suffix}
          />
        ))}
      </div>
    </div>
  );
};

const InViewCard = ({ label, value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center p-4 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-semibold text-blue-5">
        <AnimatedCounter endValue={value} duration={1000} inView={inView} />
        {suffix}
      </h2>
      <p className="text-sm text-blue-5 mt-2 font-medium text-center">{label}</p>
    </motion.div>
  );
};

export default DetailsBar;
