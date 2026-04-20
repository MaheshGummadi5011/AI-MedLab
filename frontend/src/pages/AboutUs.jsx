import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutUs = () => {
  // Data remains the same as your original component
  const projectAdmins = [
    {
      name: "Pratik Mane",
      role: "Project Admin",
      github: "https://github.com/PratikMane0112",
      avatar: "https://avatars.githubusercontent.com/u/153143167?v=4",
    },
    {
      name: "Harshwardhan Patil",
      role: "KWoC Mentor",
      github: "https://github.com/HarshwardhanPatil07",
      avatar: "https://avatars.githubusercontent.com/u/126240589?v=4",
    },
    {
      name: "Aditya Bavadekar",
      role: "SWoC Mentor",
      github: "https://github.com/AdityaBavadekar",
      avatar: "https://avatars.githubusercontent.com/u/64344960?v=4",
    },
    {
      name: "Raj Khanke",
      role: "DWoC Mentor",
      github: "https://github.com/RajKhanke",
      avatar: "https://avatars.githubusercontent.com/u/137288727?v=4",
    },
  ];

  const openSourcePrograms = [
    {
      name: "KWoC 2k24",
      link: "https://kwoc.kossiitkgp.org/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/KWoC.png",
    },
    {
      name: "SWoC 2k25",
      link: "https://www.socialwinterofcode.com/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/SWoC.png",
    },
    {
      name: "DWoC 2k25",
      link: "https://dwoc.io/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/DWoC.jpg",
    },
    {
      name: "IWoC 2k25",
      link: "https://iwoc3.devfolio.co/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/IWoC.png",
    },
  ];

  const pandemicFeatures = [
    {
      title: "Remote Consultations",
      description:
        "Secure video conferencing and chat features to maintain social distancing while providing quality care. Connect with specialists worldwide.",
      icon: "🏥",
      image:
        "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/telemedicine.jpg",
      stats: {
        value: "90%",
        label: "Patient Satisfaction",
      },
      features: ["24/7 Access", "Multi-language Support", "HD Video Quality"],
    },
    {
      title: "AI Symptom Checker",
      description:
        "Advanced AI-powered system for early detection of COVID-19 and other health conditions using machine learning algorithms.",
      icon: "🤖",
      image:
        "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/ai-health.jpg",
      stats: {
        value: "95%",
        label: "Accuracy Rate",
      },
      features: ["Real-time Analysis", "Multiple Symptoms", "Risk Assessment"],
    },
    {
      title: "Resource Allocation",
      description:
        "Smart tracking system for medical resources, hospital beds, and emergency services availability during health crises.",
      icon: "📊",
      image:
        "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/hospital-resources.jpg",
      stats: {
        value: "500+",
        label: "Connected Hospitals",
      },
      features: [
        "Live Bed Tracking",
        "Equipment Monitoring",
        "Staff Allocation",
      ],
    },
    {
      title: "Health Analytics",
      description:
        "Comprehensive health data analytics platform for tracking pandemic trends and patient outcomes.",
      icon: "📈",
      image:
        "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/health-analytics.jpg",
      stats: {
        value: "1M+",
        label: "Data Points Analyzed",
      },
      features: ["Trend Analysis", "Predictive Modeling", "Regional Insights"],
    },
    {
      title: "Emergency Response",
      description:
        "Rapid emergency response system with real-time coordination between healthcare providers and emergency services.",
      icon: "🚑",
      image:
        "https://raw.githubusercontent.com/PratikMane0112/AI-MedLab/master/Overview/emergency.jpg",
      stats: {
        value: "3min",
        label: "Avg. Response Time",
      },
      features: ["Quick Dispatch", "GPS Tracking", "Priority Routing"],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const scrollYProgress = useScrollProgress();

  return (
    <div className="w-full bg-gray-50 dark:bg-black-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex items-center relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 px-4 dark:bg-none dark:bg-black-6"
      >
        <div className="max-w-7xl mx-auto w-full ">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-5/12 space-y-8 z-10 lg:pr-8"
            >
              <div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-4 py-1 text-sm font-medium bg-blue-5 dark:bg-blue-24 text-white-1 rounded-full mb-4"
                >
                  Open Source Healthcare Initiative
                </motion.span>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight dark:text-white-1"
                >
                  Revolutionizing Telehealth in Pandemic Times
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-blue-7 leading-relaxed dark:text-white-10"
                >
                  AI-MedLab bridges the gap between patients and healthcare
                  providers through AI-powered solutions, especially critical
                  during global health crises.
                </motion.p>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/learn-more"
                    className="inline-flex items-center px-8 py-4 bg-blue-5 dark:bg-blue-24 text-white-1 font-medium rounded-xl hover:bg-blue-6 transition-all duration-300 text-lg dark:hover:bg-blue-31"
                  >
                    Start Free Consultation
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://discord.gg/qsdDRKak28"
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg border-2 border-gray-200 dark:text-white-1 dark:hover:text-gray-700"
                  >
                    <FaDiscord className="mr-2 text-2xl " /> Join Community
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-7/12 relative h-full mt-8 lg:mt-0"
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{ mixBlendMode: "normal" }}
                className="relative"
              >
                <img
                  src="aboutus-image.png"
                  alt="Platform Preview"
                  className="w-full h-auto max-w-[800px] object-contain mx-10"
                  style={{
                    mixBlendMode: "multiply",
                    filter: "contrast(1.1)",
                    transform: "scale(1.15)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pandemic Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Pandemic-Ready Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-white-1">
              Designed with lessons from COVID-19 to handle future health
              emergencies effectively
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {pandemicFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                className="bg-white-1 rounded-xl p-6 shadow-lg transition-all duration-300 dark:bg-black-0"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-black-10"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed dark:text-yellow-1">
                    {feature.description}
                  </p>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm text-gray-600 flex items-center justify-center dark:text-yellow-1"
                        >
                          <svg
                            className="w-4 h-4 text-green-500 mr-2 dark:text-green-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Leadership Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white-1">
              Project Leadership
            </h2>
            <p className="text-xl text-gray-600 dark:text-yellow-1">
              Driving innovation in open source healthcare
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projectAdmins.map((admin, index) => (
              <motion.div
                key={admin.name}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                className="bg-white rounded-2xl p-6 shadow-lg group dark:bg-black-0 dark:shadow-[0_0_10px_2px_#e4f6ff]"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-full aspect-square max-w-[200px] mx-auto mb-6 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white-10">
                    {admin.name}
                  </h3>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-4 py-1 bg-blue-100 text-blue-8 rounded-full text-sm font-medium mb-4 dark:text-blue-33 dark:bg-black-10"
                  >
                    {admin.role}
                  </motion.span>
                  <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
                    <a
                      href={admin.github}
                      className="inline-flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:text-yellow-1 dark:bg-black-10"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="mr-2 text-lg" />
                      GitHub
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contributors Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white-1">
              Our Global Contributors
            </h2>
            <p className="text-xl text-gray-600 dark:text-yellow-1">
              Join 100+ developers shaping the future of telehealth
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group px-5"
          >
            <motion.div
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 rounded-3xl shadow-lg dark:bg-none dark:bg-black-0 dark:shadow-[0_0_10px_1px_#e4f6ff] dark:opacity-100"
            />
            <a
              href="https://github.com/PratikMane0112/AI-MedLab/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block overflow-hidden rounded-2xl px-5"
            >
              <img
                src="https://contrib.rocks/image?repo=PratikMane0112/AI-MedLab&columns=12&anon=1&merge=true&max=200"
                alt="Project Contributors"
                className="w-full h-auto min-h-[400px] object-contain"
              />
            </a>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://discord.gg/qsdDRKak28"
              className="inline-flex items-center px-8 py-4 bg-blue-4 text-white-1 font-medium rounded-xl hover:bg-blue-7 transition-all duration-300 text-lg dark:bg-blue-24 dark:hover:bg-blue-31"
            >
              <FaDiscord className="mr-3 text-2xl" /> Become a Contributor
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Open Source Programs Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white-1">
              Open Source Affiliations
            </h2>
            <p className="text-xl text-gray-600 dark:text-yellow-1">
              Proudly participating in top-tier developer programs
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap justify-center gap-8"
          >
            {openSourcePrograms.map((program, index) => (
              <motion.a
                key={program.name}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                href={program.link}
                className="group flex-1 basis-[200px] max-w-[250px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col items-center">
                  <motion.img
                    initial={{ scale: 1 }}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 0.5 },
                    }}
                    src={program.logo}
                    alt={program.name}
                    className="w-32 h-32 object-contain mb-6"
                  />
                  <motion.h3
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                    className="text-xl font-semibold text-gray-800 text-center dark:text-yellow-1"
                  >
                    {program.name}
                  </motion.h3>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="mt-2 text-sm text-blue-8 flex items-center dark:text-blue-22"
                  >
                    Learn More
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Navigation Dots */}
      {/* <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
      >
        {["hero", "features", "leadership", "contributors", "programs"].map(
          (section, index) => (
            <motion.div
              key={section}
              whileHover={{ scale: 1.2 }}
              className="w-3 h-3 rounded-full bg-blue-600 cursor-pointer"
              onClick={() => {
                const element = document.getElementById(section);
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )
        )}
      </motion.div> */}

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{
          scaleX: scrollYProgress,
        }}
      />
    </div>
  );
};

// Custom hook for scroll progress
const useScrollProgress = () => {
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollYProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollYProgress;
};

export default AboutUs;
